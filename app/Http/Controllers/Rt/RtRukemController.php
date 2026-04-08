<?php

namespace App\Http\Controllers\Rt;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\RukemMember;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RtRukemController extends Controller
{
    private function getWilayahId()
    {
        return auth()->user()->managedWilayah?->id;
    }

    public function index(Request $request)
    {
        $wilayahId = $this->getWilayahId();

        $members = RukemMember::with('resident.familyCard')
            ->whereHas('resident.familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->when($request->search, function ($q, $search) {
                $q->whereHas('resident', fn($q2) => $q2->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%"));
            })
            ->when($request->status, fn($q, $status) => $q->where('status_keanggotaan', $status))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Rt/Rukem/Index', [
            'members' => $members,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function create()
    {
        $wilayahId = $this->getWilayahId();

        // Get residents in this RT who are NOT yet rukem members
        $residents = Resident::where('status_penduduk', 'aktif')
            ->whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->whereDoesntHave('rukemMember')
            ->get(['id', 'nik', 'nama_lengkap']);

        return Inertia::render('Rt/Rukem/Form', [
            'residents' => $residents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'tanggal_gabung' => 'required|date',
            'keterangan' => 'nullable|string|max:500',
        ]);

        $validated['nomor_anggota'] = RukemMember::generateNomorAnggota();
        $validated['status_keanggotaan'] = 'aktif';

        RukemMember::create($validated);

        return redirect()->route('rt.rukem.index')
            ->with('success', 'Anggota rukun kematian berhasil didaftarkan.');
    }

    public function edit(RukemMember $rukem)
    {
        $rukem->load('resident');
        return Inertia::render('Rt/Rukem/Form', [
            'member' => $rukem,
            'residents' => [],
        ]);
    }

    public function update(Request $request, RukemMember $rukem)
    {
        $validated = $request->validate([
            'status_keanggotaan' => 'required|in:aktif,nonaktif,keluar',
            'keterangan' => 'nullable|string|max:500',
        ]);

        $rukem->update($validated);

        return redirect()->route('rt.rukem.index')
            ->with('success', 'Data anggota berhasil diperbarui.');
    }
}
