<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FamilyCard;
use App\Models\Resident;
use App\Models\WilayahRtRw;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FamilyCardController extends Controller
{
    public function index(Request $request)
    {
        $query = FamilyCard::with(['kepalaKeluarga', 'wilayah'])->orderBy('no_kk');

        if ($request->has('search')) {
            $query->where('no_kk', 'like', '%' . $request->search . '%')
                  ->orWhereHas('kepalaKeluarga', function($q) use ($request) {
                      $q->where('nama_lengkap', 'like', '%' . $request->search . '%');
                  });
        }

        $familyCards = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/FamilyCards/Index', [
            'familyCards' => $familyCards,
            'filters' => $request->only('search')
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/FamilyCards/Form', [
            'residents' => Resident::select('id', 'nama_lengkap', 'nik')->where('status_penduduk', 'aktif')->get(),
            'wilayah' => WilayahRtRw::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_kk' => 'required|string|size:16|unique:family_cards',
            'kepala_keluarga_id' => 'required|exists:residents,id',
            'wilayah_id' => 'required|exists:wilayah_rt_rw,id',
            'alamat' => 'required|string',
            'kode_pos' => 'nullable|string|max:10',
        ]);

        $familyCard = FamilyCard::create($validated);

        // Update the resident to link to this KK and set them as kepala keluarga
        Resident::find($validated['kepala_keluarga_id'])->update([
            'family_card_id' => $familyCard->id,
            'hubungan_keluarga' => 'kepala'
        ]);

        return redirect()->route('admin.family-cards.index')
            ->with('success', 'Kartu Keluarga berhasil ditambahkan.');
    }

    public function show(FamilyCard $familyCard)
    {
        return Inertia::render('Admin/FamilyCards/Show', [
            'familyCard' => $familyCard->load(['kepalaKeluarga', 'wilayah', 'anggotaKeluarga']),
        ]);
    }

    public function edit(FamilyCard $familyCard)
    {
        return Inertia::render('Admin/FamilyCards/Form', [
            'familyCard' => $familyCard,
            'residents' => Resident::select('id', 'nama_lengkap', 'nik')->where('status_penduduk', 'aktif')->get(),
            'wilayah' => WilayahRtRw::all(),
        ]);
    }

    public function update(Request $request, FamilyCard $familyCard)
    {
        $validated = $request->validate([
            'no_kk' => 'required|string|size:16|unique:family_cards,no_kk,' . $familyCard->id,
            'kepala_keluarga_id' => 'required|exists:residents,id',
            'wilayah_id' => 'required|exists:wilayah_rt_rw,id',
            'alamat' => 'required|string',
            'kode_pos' => 'nullable|string|max:10',
            'status' => 'required|in:aktif,pecah_kk,pindah,hilang',
        ]);

        // If head of family changes, update logic here...
        // For simplicity, we just update the FK
        $familyCard->update($validated);

        if ($validated['kepala_keluarga_id'] !== $familyCard->kepala_keluarga_id) {
            Resident::find($validated['kepala_keluarga_id'])->update([
                'family_card_id' => $familyCard->id,
                'hubungan_keluarga' => 'kepala'
            ]);
        }

        return redirect()->route('admin.family-cards.index')
            ->with('success', 'Kartu Keluarga berhasil diperbarui.');
    }

    public function destroy(FamilyCard $familyCard)
    {
        $familyCard->delete();

        return redirect()->route('admin.family-cards.index')
            ->with('success', 'Kartu Keluarga berhasil dihapus.');
    }
}
