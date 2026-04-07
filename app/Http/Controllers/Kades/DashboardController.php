<?php

namespace App\Http\Controllers\Kades;

use App\Http\Controllers\Controller;
use App\Models\LetterRequest;
use App\Services\LetterService;
use App\Services\DemographyService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    protected $letterService;
    protected $demographyService;

    public function __construct(LetterService $letterService, DemographyService $demographyService)
    {
        $this->letterService = $letterService;
        $this->demographyService = $demographyService;
    }

    public function index(Request $request)
    {
        // Letters requiring Kades signature
        $pendingLetters = LetterRequest::with(['resident', 'letterType'])
            ->where('status', LetterRequest::STATUS_MENUNGGU_KADES)
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get();

        $stats = [
            'total_pending_signature' => LetterRequest::where('status', LetterRequest::STATUS_MENUNGGU_KADES)->count(),
            'total_letters_approved' => LetterRequest::where('status', LetterRequest::STATUS_SELESAI)->count(),
            'total_residents' => $this->demographyService->getTotalResidents(),
        ];

        return Inertia::render('Kades/Dashboard', [
            'stats' => $stats,
            'pendingLetters' => $pendingLetters,
        ]);
    }

    public function showLetter(LetterRequest $letterRequest)
    {
        // Ensure the letter needs Kades attention or is historically signed
        $letterRequest->load(['resident', 'letterType', 'logs.actor']);

        return Inertia::render('Kades/LetterDetail', [
            'letter' => $letterRequest
        ]);
    }

    public function approveLetter(Request $request, LetterRequest $letterRequest)
    {
        if ($letterRequest->status !== LetterRequest::STATUS_MENUNGGU_KADES) {
            return redirect()->back()->with('error', 'Status surat tidak memerlukan tanda tangan Anda saat ini.');
        }

        DB::beginTransaction();
        try {
            $msg = $request->input('catatan', 'Surat telah ditandatangani secara digital oleh Kepala Desa.');
            
            $this->letterService->updateStatus(
                $letterRequest, 
                LetterRequest::STATUS_SELESAI, 
                auth()->id(), 
                $msg
            );

            // Here we would also trigger PDF generation containing generating QR
            $this->letterService->generatePdf($letterRequest);
            
            DB::commit();

            return redirect()->route('kades.dashboard')->with('success', 'Surat berhasil disetujui dan ditandatangani digital.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Kades Approve Letter Error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function rejectLetter(Request $request, LetterRequest $letterRequest)
    {
        $request->validate([
            'catatan' => 'required|string|max:1000'
        ]);

        if ($letterRequest->status !== LetterRequest::STATUS_MENUNGGU_KADES) {
            return redirect()->back()->with('error', 'Status surat tidak dapat ditolak pada fase ini.');
        }

        try {
            $this->letterService->updateStatus(
                $letterRequest, 
                LetterRequest::STATUS_DITOLAK, 
                auth()->id(), 
                $request->catatan
            );

            return redirect()->route('kades.dashboard')->with('success', 'Pengajuan surat telah ditolak.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}
