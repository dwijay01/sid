<?php

namespace App\Http\Controllers\Rt;

use App\Http\Controllers\Controller;
use App\Models\FamilyCard;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RtFamilyCardController extends Controller
{
    private function getWilayahId()
    {
        return auth()->user()->managedWilayah?->id;
    }

    public function index(Request $request)
    {
        $wilayahId = $this->getWilayahId();

        $query = FamilyCard::with(['kepalaKeluarga'])
            ->where('wilayah_id', $wilayahId)
            ->orderBy('no_kk');

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('no_kk', 'like', '%' . $request->search . '%')
                  ->orWhereHas('kepalaKeluarga', function($subQ) use ($request) {
                      $subQ->where('nama_lengkap', 'like', '%' . $request->search . '%');
                  });
            });
        }

        $familyCards = $query->paginate(15)->withQueryString();

        return Inertia::render('Rt/FamilyCards/Index', [
            'familyCards' => $familyCards,
            'filters' => $request->only('search')
        ]);
    }

    public function create()
    {
        $wilayahId = $this->getWilayahId();
        
        return Inertia::render('Rt/FamilyCards/Form', [
            'residents' => Resident::select('id', 'nama_lengkap', 'nik')
                            ->where('status_penduduk', 'aktif')
                            ->whereHas('familyCard', function($q) use ($wilayahId) {
                                $q->where('wilayah_id', $wilayahId);
                            })
                            ->orWhereDoesntHave('familyCard')
                            ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_kk' => 'required|string|size:16|unique:family_cards',
            'kepala_keluarga_id' => 'nullable|exists:residents,id',
            'alamat' => 'required|string',
            'kode_pos' => 'nullable|string|max:10',
        ]);

        $validated['wilayah_id'] = $this->getWilayahId();

        $familyCard = FamilyCard::create($validated);

        if ($validated['kepala_keluarga_id']) {
            Resident::find($validated['kepala_keluarga_id'])->update([
                'family_card_id' => $familyCard->id,
                'hubungan_keluarga' => 'kepala'
            ]);
        }

        return redirect()->route('rt.family-cards.index')
            ->with('success', 'Kartu Keluarga berhasil ditambahkan.');
    }

    public function quickStore(Request $request)
    {
        $validated = $request->validate([
            'no_kk' => 'required|string|size:16|unique:family_cards',
            'alamat' => 'required|string',
        ]);

        $validated['wilayah_id'] = $this->getWilayahId();
        $validated['status'] = 'aktif';

        $familyCard = FamilyCard::create($validated);

        return response()->json([
            'success' => true,
            'family_card' => $familyCard
        ]);
    }

    public function edit(FamilyCard $familyCard)
    {
        if ($familyCard->wilayah_id != $this->getWilayahId()) {
            abort(403, 'Akses ditolak.');
        }

        $wilayahId = $this->getWilayahId();

        return Inertia::render('Rt/FamilyCards/Form', [
            'familyCard' => $familyCard,
            'residents' => Resident::select('id', 'nama_lengkap', 'nik')
                            ->where('status_penduduk', 'aktif')
                            ->whereHas('familyCard', function($q) use ($wilayahId) {
                                $q->where('wilayah_id', $wilayahId);
                            })
                            ->orWhereDoesntHave('familyCard')
                            ->get(),
        ]);
    }

    public function update(Request $request, FamilyCard $familyCard)
    {
        if ($familyCard->wilayah_id != $this->getWilayahId()) {
            abort(403, 'Akses ditolak.');
        }

        $validated = $request->validate([
            'no_kk' => 'required|string|size:16|unique:family_cards,no_kk,' . $familyCard->id,
            'kepala_keluarga_id' => 'nullable|exists:residents,id',
            'alamat' => 'required|string',
            'kode_pos' => 'nullable|string|max:10',
            'status' => 'required|in:aktif,pecah_kk,pindah,hilang',
        ]);

        $familyCard->update($validated);

        if ($validated['kepala_keluarga_id'] && $validated['kepala_keluarga_id'] !== $familyCard->kepala_keluarga_id) {
            Resident::find($validated['kepala_keluarga_id'])->update([
                'family_card_id' => $familyCard->id,
                'hubungan_keluarga' => 'kepala'
            ]);
        }

        return redirect()->route('rt.family-cards.index')
            ->with('success', 'Kartu Keluarga berhasil diperbarui.');
    }

    public function destroy(FamilyCard $familyCard)
    {
        if ($familyCard->wilayah_id != $this->getWilayahId()) {
            abort(403, 'Akses ditolak.');
        }

        $familyCard->delete();

        return redirect()->route('rt.family-cards.index')
            ->with('success', 'Kartu Keluarga berhasil dihapus.');
    }
}
