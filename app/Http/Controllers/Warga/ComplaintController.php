<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ComplaintController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if (!$user->resident) {
            return redirect()->route('profile.edit')->with('warning', 'Lengkapi profil Anda untuk mengakses layanan ini.');
        }

        $complaints = Complaint::where('resident_id', $user->resident_id)
            ->with(['resident'])
            ->latest()
            ->paginate(10)
            ->through(fn($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'category' => $c->category,
                'status' => $c->status,
                'status_label' => $c->status_label,
                'is_secret' => $c->is_secret,
                'created_at' => $c->created_at->format('d M Y H:i'),
            ]);

        return Inertia::render('Warga/Complaint/Index', [
            'complaints' => $complaints,
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        if (!$user->resident || !$user->resident->familyCard) {
            return redirect()->route('profile.edit')->with('warning', 'Validasi data kependudukan (Keluarga) Anda belum lengkap.');
        }

        return Inertia::render('Warga/Complaint/Create');
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user->resident || !$user->resident->familyCard) {
            return redirect()->back()->with('error', 'Akses ditolak.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'category' => 'required|string',
            'description' => 'required|string|max:1000',
            'attachment' => 'nullable|image|max:2048', // max 2MB
            'is_secret' => 'boolean',
        ]);

        $path = null;
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('complaints', 'public');
        }

        Complaint::create([
            'resident_id' => $user->resident_id,
            'wilayah_id' => $user->resident->familyCard->wilayah_id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'attachment_path' => $path,
            'is_secret' => $validated['is_secret'] ?? false,
            'status' => 'menunggu',
        ]);

        return redirect()->route('warga.complaints.index')->with('success', 'Laporan berhasil dikirim, menunggu tanggapan RT.');
    }

    public function show(Complaint $complaint)
    {
        $user = auth()->user();
        if ($complaint->resident_id !== $user->resident_id) {
            abort(403);
        }

        $complaint->load(['wilayah']);
        
        $complaint->status_label = $complaint->status_label;
        $complaint->formatted_date = $complaint->created_at->format('d M Y H:i');

        return Inertia::render('Warga/Complaint/Show', [
            'complaint' => $complaint,
        ]);
    }
}
