<?php

namespace App\Http\Controllers\RtRw;

use App\Http\Controllers\Controller;
use App\Models\LetterRequest;
use App\Services\LetterService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApprovalController extends Controller
{
    protected $letterService;

    public function __construct(LetterService $letterService)
    {
        $this->letterService = $letterService;
    }

    public function show(LetterRequest $letterRequest)
    {
        $letterRequest->load(['resident', 'letterType', 'logs.actor']);

        return Inertia::render('RtRw/ApprovalDetail', [
            'letter' => $letterRequest
        ]);
    }

    public function approve(Request $request, LetterRequest $letterRequest)
    {
        if ($letterRequest->status !== LetterRequest::STATUS_DIAJUKAN) {
            return redirect()->back()->with('error', 'Status surat tidak benar untuk persetujuan tingkat RT/RW.');
        }

        try {
            $msg = $request->input('catatan', 'Disetujui di tingkat RT/RW.');
            
            // This will change the status to 'menunggu_review_admin' assuming RT approves it for the village operator to see
            // In LetterService previously I used 'disetujui_rt', let's use 'menunggu_review_admin' to funnel it straight into Admin queue
            $this->letterService->updateStatus(
                $letterRequest, 
                LetterRequest::STATUS_MENUNGGU_ADMIN, 
                auth()->id(), 
                $msg
            );

            // Also save the approved_by state
            $letterRequest->update([
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);

            return redirect()->route('rtrw.dashboard')->with('success', 'Pengajuan surat berhasil disetujui dan diteruskan ke Balai Desa.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function reject(Request $request, LetterRequest $letterRequest)
    {
        $request->validate([
            'catatan' => 'required|string|max:1000'
        ]);

        if ($letterRequest->status !== LetterRequest::STATUS_DIAJUKAN) {
            return redirect()->back()->with('error', 'Status surat tidak dapat ditolak pada fase ini.');
        }

        try {
            $this->letterService->updateStatus(
                $letterRequest, 
                LetterRequest::STATUS_DITOLAK, 
                auth()->id(), 
                $request->catatan
            );

            $letterRequest->update([
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);

            return redirect()->route('rtrw.dashboard')->with('success', 'Pengajuan surat telah dikembalikan/ditolak.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}
