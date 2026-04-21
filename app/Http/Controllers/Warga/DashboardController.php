<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\LetterRequest;
use App\Models\Umkm;
use App\Models\ResidentSkill;
use App\Models\InternetSubscription;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if (!$user->resident_id) {
            return redirect()->route('profile.edit')->with('warning', 'Silakan lengkapi profil kependudukan Anda terlebih dahulu.');
        }

        $resident = $user->resident()->with('familyCard')->first();

        // 1. Active Requests (Mini Widget format)
        $activeRequests = LetterRequest::with('letterType')
            ->where('subject_resident_id', $user->resident_id)
            ->whereNotIn('status', [LetterRequest::STATUS_SELESAI, LetterRequest::STATUS_DITOLAK])
            ->orderBy('created_at', 'desc')
            ->take(2)
            ->get();

        // 1b. Active Complaints
        $activeComplaintsCount = Complaint::where('resident_id', $user->resident_id)
            ->whereNotIn('status', ['selesai', 'ditolak'])
            ->count();

        // 2. Internet Subscription Status (Tagihan)
        $internetData = null;
        if ($resident->family_card_id) {
            $subscription = InternetSubscription::with(['payments' => function ($query) {
                $now = Carbon::now();
                $query->where('month', $now->month)
                      ->where('year', $now->year);
            }])->where('family_card_id', $resident->family_card_id)->first();

            if ($subscription) {
                $currentPayment = $subscription->payments->first();
                $internetData = [
                    'status' => $subscription->status,
                    'package' => $subscription->package_name,
                    'payment_status' => $currentPayment ? $currentPayment->status : 'tunggakan', // default to tunggakan if no record yet for the month
                ];
            }
        }

        // 3. Etalase Desa (UMKM & Jasa Warga)
        $umkm = Umkm::where('status', 'aktif')
            ->with(['resident:id,nama_lengkap'])
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'umkm',
                    'title' => $item->nama_usaha,
                    'subtitle' => $item->sektor_usaha,
                    'owner' => $item->resident->nama_lengkap,
                ];
            });

        $skills = ResidentSkill::with(['resident:id,nama_lengkap'])
            ->inRandomOrder()
            ->take(4)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'jasa',
                    'title' => $item->skill_name,
                    'subtitle' => $item->category,
                    'owner' => $item->resident->nama_lengkap,
                ];
            });
            
        $etalase = $umkm->concat($skills)->shuffle()->take(6);

        // 4. Mock Papan Pengumuman (We don't have an Announcement model yet)
        $pengumuman = [
            [
                'id' => 1,
                'title' => 'Kerja Bakti Bersama',
                'date' => Carbon::now()->next(Carbon::SUNDAY)->format('d M Y'),
                'type' => 'Kegiatan',
                'bg' => 'bg-emerald-50 text-emerald-700 border-emerald-200'
            ],
            [
                'id' => 2,
                'title' => 'Jadwal Posyandu Balita',
                'date' => 'Mulai tgl 10-15',
                'type' => 'Kesehatan',
                'bg' => 'bg-blue-50 text-blue-700 border-blue-200'
            ],
            [
                'id' => 3,
                'title' => 'Pembayaran Iuran RT',
                'date' => 'Paling lambat akhir bulan',
                'type' => 'Informasi',
                'bg' => 'bg-amber-50 text-amber-700 border-amber-200'
            ]
        ];

        return Inertia::render('Warga/Dashboard', [
            'activeRequests' => $activeRequests,
            'activeComplaintsCount' => $activeComplaintsCount,
            'internetData' => $internetData,
            'etalase' => $etalase,
            'pengumuman' => $pengumuman,
        ]);
    }
}
