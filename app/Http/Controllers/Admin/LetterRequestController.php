<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LetterRequest;
use App\Models\LetterRequestLog;
use App\Services\LetterService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class LetterRequestController extends Controller
{
    protected $letterService;

    public function __construct(LetterService $letterService)
    {
        $this->letterService = $letterService;
    }

    public function queue(Request $request)
    {
        $query = LetterRequest::with(['resident', 'letterType'])
            ->whereIn('status', [LetterRequest::STATUS_MENUNGGU_ADMIN, LetterRequest::STATUS_MENUNGGU_KADES])
            ->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('resident', function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        $letterRequests = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Letters/Queue', [
            'letters' => $letterRequests,
            'filters' => $request->only('search')
        ]);
    }

    public function history(Request $request)
    {
        $query = LetterRequest::with(['resident', 'letterType'])
            ->whereIn('status', [LetterRequest::STATUS_SELESAI, LetterRequest::STATUS_DITOLAK])
            ->orderBy('updated_at', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('resident', function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        $letterRequests = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Letters/History', [
            'letters' => $letterRequests,
            'filters' => $request->only('search')
        ]);
    }

    public function show(LetterRequest $letterRequest)
    {
        $letterRequest->load(['resident', 'letterType', 'logs.actor']);
        
        return Inertia::render('Admin/Letters/Show', [
            'letter' => $letterRequest
        ]);
    }

    public function process(Request $request, LetterRequest $letterRequest)
    {
        $validated = $request->validate([
            'action' => 'required|in:approve,reject,complete',
            'catatan' => 'nullable|string|max:1000'
        ]);

        DB::beginTransaction();
        try {
            if ($validated['action'] === 'approve') {
                $this->letterService->updateStatus(
                    $letterRequest, 
                    LetterRequest::STATUS_MENUNGGU_KADES, 
                    auth()->id(), 
                    $validated['catatan'] ?? 'Dokumen telah diverifikasi admin dan diteruskan ke Kades.'
                );
            } elseif ($validated['action'] === 'reject') {
                $this->letterService->updateStatus(
                    $letterRequest, 
                    LetterRequest::STATUS_DITOLAK, 
                    auth()->id(), 
                    $validated['catatan'] ?? 'Pengajuan ditolak oleh Admin.'
                );
            } elseif ($validated['action'] === 'complete') {
                // If bypassing Kades or just completing process
                $this->letterService->updateStatus(
                    $letterRequest, 
                    LetterRequest::STATUS_SELESAI, 
                    auth()->id(), 
                    $validated['catatan'] ?? 'Diproses dan diselesaikan langsung oleh Admin.'
                );
            }
            DB::commit();

            return redirect()->back()->with('success', 'Status pengajuan surat berhasil diubah.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memproses surat: ' . $e->getMessage());
        }
    }

    public function generatePdf(LetterRequest $letter)
    {
        // Require it to be completed or at least signed by Kades
        if (!in_array($letter->status, [LetterRequest::STATUS_MENUNGGU_KADES, LetterRequest::STATUS_SELESAI])) {
            return redirect()->back()->with('error', 'Surat belum siap untuk dicetak.');
        }

        try {
            $pdfUrl = $this->letterService->generatePdf($letter);
            
            // Assuming generatePdf returns the URL or path to download
            return response()->download(storage_path('app/public/' . str_replace('/storage/', '', $pdfUrl)));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal membuat PDF: ' . $e->getMessage());
        }
    }

    public function walkIn()
    {
        $residents = \App\Models\Resident::orderBy('nama_lengkap')->get(['id', 'nama_lengkap', 'nik']);
        $letterTypes = \App\Models\LetterType::where('is_active', true)->get();

        return Inertia::render('Admin/Letters/WalkIn', [
            'residents' => $residents,
            'letterTypes' => $letterTypes
        ]);
    }

    public function storeWalkIn(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'letter_type_id' => 'required|exists:letter_types,id',
            'keperluan' => 'required|string|max:255',
            'keterangan_tambahan' => 'nullable|string',
        ]);

        try {
            // Walk-in by admin means we bypass RT/RW and go straight to admin queue or kades queue
            $letterRequest = $this->letterService->createRequest([
                'letter_type_id' => $validated['letter_type_id'],
                'subject_resident_id' => $validated['resident_id'],
                'wilayah_id' => 1, 
                'keperluan' => $validated['keperluan'],
                'data_tambahan' => $validated['keterangan_tambahan'] ?? null,
            ], auth()->id());

            // Since it's made by admin, we set it straight to Kades queue
            $this->letterService->updateStatus(
                $letterRequest, 
                LetterRequest::STATUS_MENUNGGU_KADES, 
                auth()->id(), 
                'Dibuatkan langsung (Walk-in) oleh Admin Balai Desa.'
            );
            
            return redirect()->route('admin.letters.queue')->with('success', 'Pengajuan Walk-In berhasil dibuat dan diteruskan ke Kepala Desa.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memproses Walk-In: ' . $e->getMessage());
        }
    }

    public function print(LetterRequest $letterRequest)
    {
        try {
            $pdfUrl = $this->letterService->generatePdf($letterRequest);
            return redirect($pdfUrl);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
