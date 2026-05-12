<?php

namespace App\Http\Controllers\SiePemberdayaan;

use App\Http\Controllers\Controller;
use App\Models\FamilyCard;
use App\Models\InternetSubscription;
use App\Models\InternetPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class InternetController extends Controller
{
    private function getManagedWilayahIds()
    {
        return auth()->user()->getManagedWilayahIds();
    }

    public function index(Request $request)
    {
        $wilayahIds = $this->getManagedWilayahIds();

        $subscriptions = InternetSubscription::with(['resident.wilayah', 'familyCard.wilayah'])
            ->whereHas('resident', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->when($request->search, function ($q, $search) {
                $q->whereHas('resident', fn($r) => $r->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%"))
                  ->orWhereHas('familyCard', fn($f) => $f->where('no_kk', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%"));
            })
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('SiePemberdayaan/Internet/Index', [
            'subscriptions' => $subscriptions,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function create()
    {
        $wilayahIds = $this->getManagedWilayahIds();
        $residents = \App\Models\Resident::with(['wilayah', 'familyCard.wilayah'])
            ->whereIn('wilayah_id', $wilayahIds)
            ->where('status_penduduk', 'aktif')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('SiePemberdayaan/Internet/Form', [
            'residents' => $residents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'package_name' => 'required|string|max:255',
            'installation_date' => 'required|date',
            'access_point_location' => 'nullable|string|max:255',
            'status' => 'required|in:aktif,isolir,berhenti',
            'notes' => 'nullable|string',
        ]);

        // Automatically associate family card if available
        $resident = \App\Models\Resident::find($validated['resident_id']);
        $validated['family_card_id'] = $resident->family_card_id;

        InternetSubscription::create($validated);

        return redirect()->route('sie-pemberdayaan.internet.index')
            ->with('success', 'Berlangganan internet warga berhasil didaftarkan.');
    }

    public function edit(InternetSubscription $internetSubscription)
    {
        $wilayahIds = $this->getManagedWilayahIds();
        
        $residents = \App\Models\Resident::with(['wilayah', 'familyCard.wilayah'])
            ->whereIn('wilayah_id', $wilayahIds)
            ->where('status_penduduk', 'aktif')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('SiePemberdayaan/Internet/Form', [
            'subscription' => $internetSubscription,
            'residents' => $residents,
        ]);
    }

    public function update(Request $request, InternetSubscription $internetSubscription)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'package_name' => 'required|string|max:255',
            'installation_date' => 'required|date',
            'access_point_location' => 'nullable|string|max:255',
            'status' => 'required|in:aktif,isolir,berhenti',
            'notes' => 'nullable|string',
        ]);

        $resident = \App\Models\Resident::find($validated['resident_id']);
        $validated['family_card_id'] = $resident->family_card_id;

        $internetSubscription->update($validated);

        return redirect()->route('sie-pemberdayaan.internet.index')
            ->with('success', 'Data langganan berhasil diperbarui.');
    }

    public function payments(InternetSubscription $internetSubscription, Request $request)
    {
        $year = $request->year ?? date('Y');
        
        $months = [];
        for ($m = 1; $m <= 12; $m++) {
            $months[$m] = [
                'name' => date('F', mktime(0, 0, 0, $m, 1)),
                'payment' => $internetSubscription->payments()
                    ->where('month', $m)
                    ->where('year', $year)
                    ->first()
            ];
        }

        return Inertia::render('SiePemberdayaan/Internet/Payments', [
            'subscription' => $internetSubscription->load(['familyCard', 'resident']),
            'year' => $year,
            'months' => $months,
        ]);
    }

    public function togglePayment(InternetSubscription $internetSubscription, Request $request)
    {
        $validated = $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
            'amount' => 'required|numeric',
        ]);

        $payment = InternetPayment::where('internet_subscription_id', $internetSubscription->id)
            ->where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->first();

        if ($payment) {
            $payment->delete();
            $message = 'Status pembayaran dibatalkan.';
        } else {
            InternetPayment::create([
                'internet_subscription_id' => $internetSubscription->id,
                'month' => $validated['month'],
                'year' => $validated['year'],
                'amount' => $validated['amount'],
                'status' => 'lunas',
                'payment_date' => now(),
            ]);
            $message = 'Pembayaran berhasil dikonfirmasi.';
        }

        return back()->with('success', $message);
    }
}
