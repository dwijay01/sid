<?php

namespace App\Http\Controllers\RtRw;

use App\Http\Controllers\Controller;
use App\Models\LetterType;
use App\Models\Resident;
use App\Services\LetterService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BypassInputController extends Controller
{
    protected $letterService;

    public function __construct(LetterService $letterService)
    {
        $this->letterService = $letterService;
    }

    public function create()
    {
        // For bypass, RT needs to find users in their assigned area
        // Mocking for demo: fetch all
        $residents = Resident::orderBy('nama_lengkap')->get(['id', 'nama_lengkap', 'nik']);
        
        return Inertia::render('RtRw/BypassInput', [
            'letterTypes' => LetterType::where('is_active', true)->get(),
            'residents' => $residents
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'letter_type_id' => 'required|exists:letter_types,id',
            'keperluan' => 'required|string|max:255',
            'keterangan_tambahan' => 'nullable|string',
        ]);

        try {
            // Because RT makes it, we can say it's automatically approved by RT
            // But we must create the request first.
            // Using system user ID or RT's ID as the pemohon_user_id
            
            $letterRequest = $this->letterService->createRequest([
                'letter_type_id' => $validated['letter_type_id'],
                'subject_resident_id' => $validated['resident_id'],
                'wilayah_id' => 1, // mocked
                'keperluan' => $validated['keperluan'],
                'data_tambahan' => $validated['keterangan_tambahan'] ?? null,
            ], auth()->id());

            // Auto approve since RT made it
            $this->letterService->updateStatus(
                $letterRequest, 
                'menunggu_review_admin', 
                auth()->id(), 
                'Dibuatkan langsung dan disetujui (Bypass) oleh Pengurus Lingkungan.'
            );
            
            $letterRequest->update([
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);

            return redirect()->route('rtrw.dashboard')->with('success', 'Pengajuan (Bypass) berhasil dibuat dan diteruskan ke Balai Desa.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memproses bypass: ' . $e->getMessage());
        }
    }
}
