<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PopulationMutation;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MutationController extends Controller
{
    public function index(Request $request)
    {
        $mutations = PopulationMutation::with(['resident', 'processor'])
            ->when($request->search, function ($q, $search) {
                $q->whereHas('resident', function ($q2) use ($search) {
                    $q2->where('nama_lengkap', 'like', "%{$search}%")
                       ->orWhere('nik', 'like', "%{$search}%");
                });
            })
            ->when($request->type, function ($q, $type) {
                $q->where('type', $type);
            })
            ->orderByDesc('tanggal_mutasi')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Mutations/Index', [
            'mutations' => $mutations,
            'filters' => $request->only('search', 'type'),
        ]);
    }

    public function create()
    {
        $residents = Resident::where('status_penduduk', 'aktif')
            ->get(['id', 'nik', 'nama_lengkap']);

        return Inertia::render('Admin/Mutations/Create', [
            'residents' => $residents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'type' => 'required|in:lahir,mati,pindah_keluar,pindah_masuk,datang',
            'tanggal_mutasi' => 'required|date',
            'keterangan' => 'nullable|string|max:1000',
            'asal_tujuan' => 'nullable|string|max:255',
            'no_surat_mutasi' => 'nullable|string|max:100',
        ]);

        $validated['processed_by'] = auth()->id();

        PopulationMutation::create($validated);

        // Update resident status based on mutation type
        $resident = Resident::find($validated['resident_id']);
        if ($resident) {
            $statusMap = [
                'mati' => 'meninggal',
                'pindah_keluar' => 'pindah',
            ];
            if (isset($statusMap[$validated['type']])) {
                $resident->update(['status_penduduk' => $statusMap[$validated['type']]]);
            }
        }

        return redirect()->route('admin.mutations.index')
            ->with('success', 'Data mutasi berhasil dicatat.');
    }

    public function destroy(PopulationMutation $mutation)
    {
        $mutation->delete();

        return redirect()->route('admin.mutations.index')
            ->with('success', 'Data mutasi berhasil dihapus.');
    }
}
