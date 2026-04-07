<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\LetterRequest;
use App\Models\LetterType;
use App\Services\LetterService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class LetterRequestController extends Controller
{
    protected $letterService;

    public function __construct(LetterService $letterService)
    {
        $this->letterService = $letterService;
    }

    public function create()
    {
        return Inertia::render('Warga/LetterRequest/Form', [
            'letterTypes' => LetterType::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'letter_type_id' => 'required|exists:letter_types,id',
            'keperluan' => 'required|string|max:255',
            'keterangan_tambahan' => 'nullable|string',
            // File upload logic can be added here depending on letter requirements
        ]);

        try {
            $user = auth()->user();
            $letterRequest = $this->letterService->createRequest([
                'letter_type_id' => $validated['letter_type_id'],
                'subject_resident_id' => $user->resident_id,
                'wilayah_id' => $user->resident?->wilayah_id ?? 1, // Fallback if no wilayah
                'keperluan' => $validated['keperluan'],
                'data_tambahan' => $validated['keterangan_tambahan'] ?? null,
            ], $user->id);

            return redirect()->route('warga.letters.track', $letterRequest->id)
                ->with('success', 'Pengajuan surat berhasil dikirim.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengajukan surat: ' . $e->getMessage());
        }
    }

    public function track(LetterRequest $letterRequest)
    {
        // Ensure user can only track their own letter
        if ($letterRequest->subject_resident_id !== auth()->user()->resident_id) {
            abort(403, 'Unauthorized action.');
        }

        $letterRequest->load(['letterType', 'logs.actor']);

        return Inertia::render('Warga/LetterRequest/Track', [
            'letter' => $letterRequest,
        ]);
    }

    public function history()
    {
        $history = LetterRequest::with('letterType')
            ->where('subject_resident_id', auth()->user()->resident_id)
            ->whereIn('status', [LetterRequest::STATUS_SELESAI, LetterRequest::STATUS_DITOLAK])
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        return Inertia::render('Warga/LetterRequest/History', [
            'history' => $history,
        ]);
    }

    public function downloadPdf(LetterRequest $letterRequest)
    {
        // Ensure user can only download their own letter
        if ($letterRequest->subject_resident_id !== auth()->user()->resident_id) {
            abort(403, 'Unauthorized action.');
        }

        // Only allow downloading completed letters
        if ($letterRequest->status !== LetterRequest::STATUS_SELESAI) {
            return redirect()->back()->with('error', 'Surat belum selesai diproses.');
        }

        try {
            $pdfUrl = $this->letterService->generatePdf($letterRequest);
            
            // Assuming generatePdf returns a URL like /storage/letters/filename.pdf
            $path = str_replace('/storage/', '', $pdfUrl);
            
            if (!Storage::disk('public')->exists($path)) {
                return redirect()->back()->with('error', 'File PDF tidak ditemukan di server.');
            }

            return Storage::disk('public')->download($path);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengunduh PDF: ' . $e->getMessage());
        }
    }
}
