<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PopulationMutation;
use App\Models\Resident;
use App\Models\FamilyCard;
use App\Models\LetterTemplate;
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

    public function createBirth()
    {
        $familyCards = FamilyCard::with('kepalaKeluarga:id,nik,nama_lengkap')->where('status', 'aktif')->get();
        return Inertia::render('Admin/Mutations/CreateBirth', [
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
            'jam_lahir' => 'required|string',
            'berat' => 'nullable|numeric',
            'panjang' => 'nullable|numeric',
            'family_card_id' => 'required|exists:family_cards,id',
            'hubungan_keluarga' => 'required|string',
            'ayah_nik' => 'nullable|string|max:16',
            'ibu_nik' => 'nullable|string|max:16',
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
            'metadata' => [
                'jam_lahir' => $validated['jam_lahir'],
                'berat' => $validated['berat'],
                'panjang' => $validated['panjang'],
                'ayah_nik' => $validated['ayah_nik'],
                'ibu_nik' => $validated['ibu_nik'],
                'is_temporary_nik' => true,
            ]
        ]);

        return redirect()->route('admin.mutations.index')->with('success', 'Data Kelahiran berhasil didaftarkan dan bayi masuk ke KK terpilih.');
    }

    public function createDeath()
    {
        $residents = Resident::where('status_penduduk', 'aktif')
            ->get(['id', 'nik', 'nama_lengkap']);

        return Inertia::render('Admin/Mutations/CreateDeath', [
            'residents' => $residents,
        ]);
    }

    public function storeDeath(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'tanggal_mati' => 'required|date',
            'jam_mati' => 'required|string',
            'tempat_mati' => 'required|string|max:255',
            'penyebab' => 'required|string|max:255',
            'pelapor_nik' => 'nullable|string|max:16',
            'keterangan' => 'nullable|string',
        ]);

        $resident = Resident::findOrFail($validated['resident_id']);
        $resident->update(['status_penduduk' => 'meninggal']);

        PopulationMutation::create([
            'resident_id' => $resident->id,
            'type' => 'mati',
            'tanggal_mutasi' => $validated['tanggal_mati'],
            'keterangan' => $validated['keterangan'] ?? 'Mutasi Kematian',
            'processed_by' => auth()->id(),
            'metadata' => [
                'jam_mati' => $validated['jam_mati'],
                'tempat_mati' => $validated['tempat_mati'],
                'penyebab' => $validated['penyebab'],
                'pelapor_nik' => $validated['pelapor_nik'],
            ]
        ]);

        return redirect()->route('admin.mutations.index')->with('success', 'Data Kematian berhasil dicatat, status warga telah dinonaktifkan.');
    }

    public function print(PopulationMutation $mutation)
    {
        $mutation->load(['resident.familyCard.kepalaKeluarga']);
        
        $templateName = $mutation->type == 'lahir' ? 'Surat Keterangan Kelahiran' : 'Surat Keterangan Kematian';
        $template = LetterTemplate::where('name', $templateName)->first();
        
        if (!$template) {
            return back()->with('error', "Template surat '{$templateName}' tidak ditemukan. Harap buat template tersebut terlebih dahulu pada Master Template.");
        }

        return Inertia::render('Admin/Mutations/Print', [
            'mutation' => $mutation,
            'template' => $template,
        ]);
    }
}
