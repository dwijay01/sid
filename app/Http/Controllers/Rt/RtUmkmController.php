<?php

namespace App\Http\Controllers\Rt;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RtUmkmController extends Controller
{
    private function getWilayahId()
    {
        return auth()->user()->managedWilayah?->id;
    }

    public function index(Request $request)
    {
        $wilayahId = $this->getWilayahId();

        $umkm = Umkm::with('resident.familyCard.wilayah')
            ->whereHas('resident.familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->when($request->search, function ($q, $search) {
                $q->where('nama_usaha', 'like', "%{$search}%")
                  ->orWhereHas('resident', fn($r) => $r->where('nama_lengkap', 'like', "%{$search}%"));
            })
            ->when($request->sektor, fn($q, $sektor) => $q->where('sektor_usaha', $sektor))
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Rt/Umkm/Index', [
            'umkm' => $umkm,
            'filters' => $request->only('search', 'sektor', 'status'),
        ]);
    }

    public function create()
    {
        $wilayahId = $this->getWilayahId();

        $residents = Resident::where('status_penduduk', 'aktif')
            ->whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->orderBy('nama_lengkap')
            ->get(['id', 'nik', 'nama_lengkap', 'alamat_sekarang', 'family_card_id']);

        return Inertia::render('Rt/Umkm/Form', [
            'residents' => $residents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'nama_usaha' => 'required|string|max:255',
            'sektor_usaha' => 'required|in:kuliner,jasa,perdagangan,pertanian,kerajinan,teknologi,lainnya',
            'alamat_sama_domisili' => 'required|boolean',
            'alamat_usaha' => 'nullable|required_if:alamat_sama_domisili,false|string|max:500',
            'foto_tempat_usaha' => 'nullable|image|max:2048',
            'memiliki_nib' => 'required|boolean',
            'nomor_nib' => 'nullable|required_if:memiliki_nib,true|string|max:50',
            'rentang_omzet' => 'required|in:belum_ada,<1jt,1-5jt,5-15jt,15-50jt,>50jt',
            'jumlah_karyawan' => 'required|in:0,1-4,5-19,20+',
            'deskripsi' => 'nullable|string|max:1000',
            'status' => 'required|in:aktif,nonaktif,tutup',
        ]);

        if ($request->hasFile('foto_tempat_usaha')) {
            $validated['foto_tempat_usaha'] = $request->file('foto_tempat_usaha')
                ->store('umkm/fotos', 'public');
        }

        Umkm::create($validated);

        return redirect()->route('rt.umkm.index')
            ->with('success', 'Data UMKM berhasil ditambahkan.');
    }

    public function edit(Umkm $umkm)
    {
        $umkm->load('resident');
        $wilayahId = $this->getWilayahId();

        $residents = Resident::where('status_penduduk', 'aktif')
            ->whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->orderBy('nama_lengkap')
            ->get(['id', 'nik', 'nama_lengkap', 'alamat_sekarang', 'family_card_id']);

        return Inertia::render('Rt/Umkm/Form', [
            'umkm' => $umkm,
            'residents' => $residents,
        ]);
    }

    public function update(Request $request, Umkm $umkm)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'nama_usaha' => 'required|string|max:255',
            'sektor_usaha' => 'required|in:kuliner,jasa,perdagangan,pertanian,kerajinan,teknologi,lainnya',
            'alamat_sama_domisili' => 'required|boolean',
            'alamat_usaha' => 'nullable|required_if:alamat_sama_domisili,false|string|max:500',
            'foto_tempat_usaha' => 'nullable|image|max:2048',
            'memiliki_nib' => 'required|boolean',
            'nomor_nib' => 'nullable|required_if:memiliki_nib,true|string|max:50',
            'rentang_omzet' => 'required|in:belum_ada,<1jt,1-5jt,5-15jt,15-50jt,>50jt',
            'jumlah_karyawan' => 'required|in:0,1-4,5-19,20+',
            'deskripsi' => 'nullable|string|max:1000',
            'status' => 'required|in:aktif,nonaktif,tutup',
        ]);

        if ($request->hasFile('foto_tempat_usaha')) {
            // Delete old photo if exists
            if ($umkm->foto_tempat_usaha) {
                Storage::disk('public')->delete($umkm->foto_tempat_usaha);
            }
            $validated['foto_tempat_usaha'] = $request->file('foto_tempat_usaha')
                ->store('umkm/fotos', 'public');
        }

        $umkm->update($validated);

        return redirect()->route('rt.umkm.index')
            ->with('success', 'Data UMKM berhasil diperbarui.');
    }

    public function destroy(Umkm $umkm)
    {
        if ($umkm->foto_tempat_usaha) {
            Storage::disk('public')->delete($umkm->foto_tempat_usaha);
        }

        $umkm->delete();

        return redirect()->route('rt.umkm.index')
            ->with('success', 'Data UMKM berhasil dihapus.');
    }
}
