<?php

namespace App\Http\Controllers\Rw;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\WilayahRtRw;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    private function getWilayahIds()
    {
        return auth()->user()->getManagedWilayahIds();
    }

    public function index(Request $request)
    {
        $wilayahIds = $this->getWilayahIds();

        $query = Complaint::with(['resident', 'wilayah'])
            ->whereIn('wilayah_id', $wilayahIds);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('rt') && $request->rt) {
            $query->whereHas('wilayah', fn($q) => $q->where('rt', $request->rt));
        }

        $complaints = $query->latest()->paginate(15)->withQueryString()->through(fn($c) => [
            'id' => $c->id,
            'title' => $c->title,
            'category' => $c->category,
            'status' => $c->status,
            'status_label' => $c->status_label,
            'created_at' => $c->created_at->format('d M Y H:i'),
            'resident_name' => $c->is_secret ? 'Warga Anonim' : ($c->resident->nama_lengkap ?? 'Tidak Diketahui'),
            'is_secret' => $c->is_secret,
            'wilayah_name' => $c->wilayah ? "RT {$c->wilayah->rt}" : '-',
            'is_escalated' => $c->status === 'diteruskan_rw',
        ]);

        $wilayahList = WilayahRtRw::whereIn('id', $wilayahIds)->get(['id', 'rt', 'rw']);

        return Inertia::render('Rw/Complaint/Index', [
            'complaints' => $complaints,
            'filters' => $request->only('status', 'rt'),
            'wilayahList' => $wilayahList,
        ]);
    }

    public function show(Complaint $complaint)
    {
        $wilayahIds = $this->getWilayahIds();
        if (!in_array($complaint->wilayah_id, $wilayahIds)) {
            abort(403);
        }

        $complaint->load(['resident', 'wilayah']);
        $complaint->status_label = $complaint->status_label;
        $complaint->formatted_date = $complaint->created_at->format('d M Y H:i');

        return Inertia::render('Rw/Complaint/Show', [
            'complaint' => $complaint,
        ]);
    }

    public function updateStatus(Request $request, Complaint $complaint)
    {
        $wilayahIds = $this->getWilayahIds();
        if (!in_array($complaint->wilayah_id, $wilayahIds)) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:selesai,ditolak',
            'rw_response' => 'nullable|string|max:1000',
        ]);

        $complaint->update([
            'status' => $validated['status'],
            'rw_response' => $validated['rw_response'] ?? $complaint->rw_response,
        ]);

        return redirect()->back()->with('success', 'Status pengaduan berhasil diperbarui oleh RW.');
    }
}
