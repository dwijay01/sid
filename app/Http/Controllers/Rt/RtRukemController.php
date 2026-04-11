<?php

namespace App\Http\Controllers\Rt;

use App\Http\Controllers\Controller;
use App\Models\FamilyCard;
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

        $members = RukemMember::with('familyCard.kepalaKeluarga')
            ->whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->when($request->search, function ($q, $search) {
                $q->whereHas('familyCard', fn($fc) => $fc->where('no_kk', 'like', "%{$search}%")
                    ->orWhereHas('kepalaKeluarga', fn($k) => $k->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('nik', 'like', "%{$search}%")));
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

        // Get FamilyCards in this RT who are NOT yet rukem members
        $familyCards = FamilyCard::with(['kepalaKeluarga' => function($q){
            $q->select('id', 'nik', 'nama_lengkap');
        }])
            ->where('wilayah_id', $wilayahId)
            ->where('status', 'aktif')
            ->whereDoesntHave('rukemMember')
            ->get(['id', 'no_kk', 'kepala_keluarga_id']);

        return Inertia::render('Rt/Rukem/Form', [
            'familyCards' => $familyCards,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'family_card_id' => 'required|exists:family_cards,id|unique:rukem_members,family_card_id',
            'tanggal_gabung' => 'required|date',
            'status_keanggotaan' => 'required|in:aktif,nonaktif,khusus,keluar,tidak_ikut',
            'keterangan' => 'nullable|string|max:500',
        ]);

        $validated['nomor_anggota'] = RukemMember::generateNomorAnggota();

        RukemMember::create($validated);

        return redirect()->route('rt.rukem.index')
            ->with('success', 'Anggota rukun kematian berhasil didaftarkan.');
    }

    public function edit(RukemMember $rukem)
    {
        $rukem->load('familyCard.kepalaKeluarga');
        return Inertia::render('Rt/Rukem/Form', [
            'member' => $rukem,
            'familyCards' => [],
        ]);
    }

    public function update(Request $request, RukemMember $rukem)
    {
        $validated = $request->validate([
            'status_keanggotaan' => 'required|in:aktif,nonaktif,khusus,keluar,tidak_ikut',
            'keterangan' => 'nullable|string|max:500',
        ]);

        $rukem->update($validated);

        return redirect()->route('rt.rukem.index')
            ->with('success', 'Data anggota berhasil diperbarui.');
    }
}
