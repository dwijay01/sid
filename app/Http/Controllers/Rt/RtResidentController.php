<?php

namespace App\Http\Controllers\Rt;

use App\Http\Controllers\Controller;
use App\Models\FamilyCard;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RtResidentController extends Controller
{
    private function getWilayahId()
    {
        return auth()->user()->managedWilayah?->id;
    }

    public function create(Request $request)
    {
        $wilayahId = $this->getWilayahId();
        $familyCards = FamilyCard::where('wilayah_id', $wilayahId)
            ->select('id', 'no_kk')
            ->get();

        return Inertia::render('Rt/Residents/Form', [
            'familyCards' => $familyCards,
            'defaultFamilyCardId' => $request->query('family_card_id', ''),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|string|size:16|unique:residents',
            'nama_lengkap' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'required|in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
            'status_perkawinan' => 'required|in:belum_kawin,kawin,cerai_hidup,cerai_mati',
            'golongan_darah' => 'required|in:A,B,AB,O,tidak_tahu',
            'pekerjaan' => 'nullable|string|max:255',
            'pendidikan' => 'required|in:tidak_sekolah,SD,SMP,SMA,D1,D2,D3,S1,S2,S3',
            'hubungan_keluarga' => 'required|in:kepala,istri,anak,menantu,cucu,orang_tua,mertua,famili_lain,lainnya',
            'family_card_id' => 'nullable|exists:family_cards,id',
            'alamat_sekarang' => 'nullable|string',
        ]);

        // Ensure family card belongs to the RT's wilayah
        if ($validated['family_card_id']) {
            $fc = FamilyCard::find($validated['family_card_id']);
            if ($fc && $fc->wilayah_id != $this->getWilayahId()) {
                return back()->with('error', 'Kartu Keluarga tidak termasuk dalam wilayah Anda.');
            }
        }

        Resident::create($validated);

        return redirect()->route('rt.residents')
            ->with('success', 'Data penduduk berhasil ditambahkan.');
    }

    public function edit(Resident $resident)
    {
        // Ensure resident is in RT's wilayah
        $wilayahId = $this->getWilayahId();
        if ($resident->familyCard && $resident->familyCard->wilayah_id != $wilayahId) {
            abort(403, 'Warga bukan anggota wilayah Anda.');
        }

        $familyCards = FamilyCard::where('wilayah_id', $wilayahId)
            ->select('id', 'no_kk')
            ->get();

        return Inertia::render('Rt/Residents/Form', [
            'resident' => $resident,
            'familyCards' => $familyCards,
        ]);
    }

    public function update(Request $request, Resident $resident)
    {
        // Ensure resident is in RT's wilayah
        $wilayahId = $this->getWilayahId();
        if ($resident->familyCard && $resident->familyCard->wilayah_id != $wilayahId) {
            abort(403, 'Warga bukan anggota wilayah Anda.');
        }

        $validated = $request->validate([
            'nik' => 'required|string|size:16|unique:residents,nik,' . $resident->id,
            'nama_lengkap' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'required|in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
            'status_perkawinan' => 'required|in:belum_kawin,kawin,cerai_hidup,cerai_mati',
            'golongan_darah' => 'required|in:A,B,AB,O,tidak_tahu',
            'pekerjaan' => 'nullable|string|max:255',
            'pendidikan' => 'required|in:tidak_sekolah,SD,SMP,SMA,D1,D2,D3,S1,S2,S3',
            'hubungan_keluarga' => 'required|in:kepala,istri,anak,menantu,cucu,orang_tua,mertua,famili_lain,lainnya',
            'family_card_id' => 'nullable|exists:family_cards,id',
            'alamat_sekarang' => 'nullable|string',
        ]);

        $resident->update($validated);

        return redirect()->route('rt.residents')
            ->with('success', 'Data penduduk berhasil diperbarui.');
    }
}
