<?php

namespace App\Http\Controllers\Rt;

use App\Http\Controllers\Controller;
use App\Models\LetterRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RtLetterController extends Controller
{
    private function getWilayahId()
    {
        return auth()->user()->managedWilayah?->id;
    }

    public function index(Request $request)
    {
        $wilayahId = $this->getWilayahId();

        $letters = LetterRequest::with(['resident', 'letterType', 'pemohon'])
            ->where('wilayah_id', $wilayahId)
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Rt/Letters/Index', [
            'letters' => $letters,
            'filters' => $request->only('status'),
        ]);
    }

    public function show(LetterRequest $letterRequest)
    {
        $wilayahId = $this->getWilayahId();
        if ($letterRequest->wilayah_id !== $wilayahId) {
            abort(403, 'Surat bukan dari wilayah Anda.');
        }

        $letterRequest->load(['resident.familyCard', 'letterType', 'pemohon', 'logs']);

        return Inertia::render('Rt/Letters/Show', [
            'letterRequest' => $letterRequest,
        ]);
    }

    public function approve(LetterRequest $letterRequest)
    {
        $wilayahId = $this->getWilayahId();
        if ($letterRequest->wilayah_id !== $wilayahId) {
            abort(403, 'Surat bukan dari wilayah Anda.');
        }

        $letterRequest->update([
            'status' => 'disetujui_rt',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Surat berhasil disetujui.');
    }

    public function reject(Request $request, LetterRequest $letterRequest)
    {
        $wilayahId = $this->getWilayahId();
        if ($letterRequest->wilayah_id !== $wilayahId) {
            abort(403, 'Surat bukan dari wilayah Anda.');
        }

        $request->validate(['alasan' => 'required|string|max:500']);

        $letterRequest->update([
            'status' => 'ditolak_rt',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'catatan' => $request->alasan,
        ]);

        return back()->with('success', 'Surat berhasil ditolak.');
    }
}
