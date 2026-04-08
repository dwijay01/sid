<?php

namespace App\Http\Controllers\Rt;

use App\Http\Controllers\Controller;
use App\Models\FamilyCard;
use App\Models\PopulationMutation;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RtMutationController extends Controller
{
    private function getWilayahId()
    {
        return auth()->user()->managedWilayah?->id;
    }

    public function index(Request $request)
    {
        $wilayahId = $this->getWilayahId();

        $mutations = PopulationMutation::with(['resident.familyCard', 'processor'])
            ->whereHas('resident.familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->when($request->search, function ($q, $search) {
                $q->whereHas('resident', fn($q2) => $q2->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%"));
            })
            ->when($request->type, fn($q, $type) => $q->where('type', $type))
            ->orderByDesc('tanggal_mutasi')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Rt/Mutations/Index', [
            'mutations' => $mutations,
            'filters' => $request->only('search', 'type'),
        ]);
    }

    // ---- PINDAH KELUAR ----
    public function createMoveOut()
    {
        $wilayahId = $this->getWilayahId();
        $residents = Resident::where('status_penduduk', 'aktif')
            ->whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->get(['id', 'nik', 'nama_lengkap']);

        return Inertia::render('Rt/Mutations/FormMoveOut', [
            'residents' => $residents,
        ]);
    }

    public function storeMoveOut(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'tanggal_mutasi' => 'required|date',
            'asal_tujuan' => 'required|string|max:255',
            'keterangan' => 'nullable|string|max:1000',
        ]);

        $resident = Resident::findOrFail($validated['resident_id']);
        $resident->update(['status_penduduk' => 'pindah']);

        PopulationMutation::create([
            'resident_id' => $validated['resident_id'],
            'type' => 'pindah_keluar',
            'tanggal_mutasi' => $validated['tanggal_mutasi'],
            'asal_tujuan' => $validated['asal_tujuan'],
            'keterangan' => $validated['keterangan'] ?? 'Pindah keluar',
            'processed_by' => auth()->id(),
        ]);

        return redirect()->route('rt.mutations.index')
            ->with('success', 'Data warga pindah berhasil dicatat.');
    }

    // ---- PINDAH MASUK ----
    public function createMoveIn()
    {
        $wilayahId = $this->getWilayahId();
        $familyCards = FamilyCard::where('wilayah_id', $wilayahId)
            ->with('kepalaKeluarga:id,nik,nama_lengkap')
            ->where('status', 'aktif')
            ->get();

        return Inertia::render('Rt/Mutations/FormMoveIn', [
            'familyCards' => $familyCards,
        ]);
    }

    public function storeMoveIn(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:residents,nik',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'required|in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
            'family_card_id' => 'required|exists:family_cards,id',
            'hubungan_keluarga' => 'required|string',
            'asal_tujuan' => 'required|string|max:255',
            'tanggal_mutasi' => 'required|date',
            'keterangan' => 'nullable|string|max:1000',
        ]);

        $resident = Resident::create([
            'nik' => $validated['nik'],
            'nama_lengkap' => $validated['nama_lengkap'],
            'tempat_lahir' => $validated['tempat_lahir'],
            'tanggal_lahir' => $validated['tanggal_lahir'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'agama' => $validated['agama'],
            'family_card_id' => $validated['family_card_id'],
            'hubungan_keluarga' => $validated['hubungan_keluarga'],
            'status_penduduk' => 'aktif',
        ]);

        PopulationMutation::create([
            'resident_id' => $resident->id,
            'type' => 'pindah_masuk',
            'tanggal_mutasi' => $validated['tanggal_mutasi'],
            'asal_tujuan' => $validated['asal_tujuan'],
            'keterangan' => $validated['keterangan'] ?? 'Pindah masuk',
            'processed_by' => auth()->id(),
        ]);

        return redirect()->route('rt.mutations.index')
            ->with('success', 'Data warga masuk berhasil dicatat.');
    }

    // ---- MENINGGAL ----
    public function createDeath()
    {
        $wilayahId = $this->getWilayahId();
        $residents = Resident::where('status_penduduk', 'aktif')
            ->whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->get(['id', 'nik', 'nama_lengkap']);

        return Inertia::render('Rt/Mutations/FormDeath', [
            'residents' => $residents,
        ]);
    }

    public function storeDeath(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'tanggal_mutasi' => 'required|date',
            'tempat_mati' => 'required|string|max:255',
            'penyebab' => 'required|string|max:255',
            'keterangan' => 'nullable|string|max:1000',
        ]);

        $resident = Resident::findOrFail($validated['resident_id']);
        $resident->update(['status_penduduk' => 'meninggal']);

        PopulationMutation::create([
            'resident_id' => $validated['resident_id'],
            'type' => 'mati',
            'tanggal_mutasi' => $validated['tanggal_mutasi'],
            'keterangan' => $validated['keterangan'] ?? 'Meninggal dunia',
            'processed_by' => auth()->id(),
            'metadata' => [
                'tempat_mati' => $validated['tempat_mati'],
                'penyebab' => $validated['penyebab'],
            ],
        ]);

        return redirect()->route('rt.mutations.index')
            ->with('success', 'Data kematian berhasil dicatat.');
    }

    // ---- KELAHIRAN ----
    public function createBirth()
    {
        $wilayahId = $this->getWilayahId();
        $familyCards = FamilyCard::where('wilayah_id', $wilayahId)
            ->with('kepalaKeluarga:id,nik,nama_lengkap')
            ->where('status', 'aktif')
            ->get();

        return Inertia::render('Rt/Mutations/FormBirth', [
            'familyCards' => $familyCards,
        ]);
    }

    public function storeBirth(Request $request)
    {
        $validated = $request->validate([
            'nama_bayi' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'family_card_id' => 'required|exists:family_cards,id',
            'hubungan_keluarga' => 'required|string',
            'keterangan' => 'nullable|string',
        ]);

        $tempNik = 'B' . date('ymdHis') . rand(100, 999);

        $resident = Resident::create([
            'nik' => $tempNik,
            'nama_lengkap' => $validated['nama_bayi'],
            'tempat_lahir' => $validated['tempat_lahir'],
            'tanggal_lahir' => $validated['tanggal_lahir'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'family_card_id' => $validated['family_card_id'],
            'hubungan_keluarga' => $validated['hubungan_keluarga'],
            'status_penduduk' => 'aktif',
            'agama' => 'Islam',
            'pendidikan' => 'tidak_sekolah',
            'pekerjaan' => 'belum_tidak_bekerja',
            'status_perkawinan' => 'belum_kawin',
        ]);

        PopulationMutation::create([
            'resident_id' => $resident->id,
            'type' => 'lahir',
            'tanggal_mutasi' => $validated['tanggal_lahir'],
            'keterangan' => $validated['keterangan'] ?? 'Kelahiran baru (NIK Sementara)',
            'processed_by' => auth()->id(),
            'metadata' => ['is_temporary_nik' => true],
        ]);

        return redirect()->route('rt.mutations.index')
            ->with('success', 'Data kelahiran berhasil didaftarkan.');
    }
}
