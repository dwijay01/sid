<?php

namespace App\Http\Controllers\Rt;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    private function getWilayahId()
    {
        return auth()->user()->managedWilayah?->id;
    }

    public function index(Request $request)
    {
        $wilayahId = $this->getWilayahId();

        $query = Complaint::with(['resident', 'wilayah'])
            ->where('wilayah_id', $wilayahId);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
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
        ]);

        return Inertia::render('Rt/Complaint/Index', [
            'complaints' => $complaints,
            'filters' => $request->only('status'),
        ]);
    }

    public function updateStatus(Request $request, Complaint $complaint)
    {
        $wilayahId = $this->getWilayahId();
        if ($complaint->wilayah_id !== $wilayahId) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:diproses_rt,diteruskan_rw,selesai,ditolak',
            'rt_response' => 'nullable|string|max:1000',
        ]);

        $complaint->update([
            'status' => $validated['status'],
            'rt_response' => $validated['rt_response'] ?? $complaint->rt_response,
        ]);

        return redirect()->back()->with('success', 'Status pengaduan berhasil diperbarui.');
    }

    public function show(Complaint $complaint)
    {
        $wilayahId = $this->getWilayahId();
        if ($complaint->wilayah_id !== $wilayahId) {
            abort(403);
        }

        $complaint->load(['resident', 'wilayah']);
        $complaint->status_label = $complaint->status_label;
        $complaint->formatted_date = $complaint->created_at->format('d M Y H:i');
        
        if ($complaint->is_secret) {
            // Mask the identity for RT if it's secret
            $complaint->resident->nama_lengkap = 'Warga Anonim (Identitas Dirahasiakan)';
            $complaint->resident->nik = '****************';
        }

        return Inertia::render('Rt/Complaint/Show', [
            'complaint' => $complaint,
        ]);
    }
}
