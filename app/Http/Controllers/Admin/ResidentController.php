<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\FamilyCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResidentController extends Controller
{
    public function index(Request $request)
    {
        $query = Resident::with('familyCard.wilayah')->orderBy('nama_lengkap');

        if ($request->has('search')) {
            $query->where('nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('nik', 'like', '%' . $request->search . '%');
        }

        $residents = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Residents/Index', [
            'residents' => $residents,
            'filters' => $request->only('search')
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Residents/Form', [
            'familyCards' => FamilyCard::select('id', 'no_kk')->get(),
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

        Resident::create($validated);

        return redirect()->route('admin.residents.index')
            ->with('success', 'Data penduduk berhasil ditambahkan.');
    }

    public function show(Resident $resident)
    {
        return Inertia::render('Admin/Residents/Show', [
            'resident' => $resident->load(['familyCard.wilayah', 'documents', 'mutations']),
        ]);
    }

    public function edit(Resident $resident)
    {
        return Inertia::render('Admin/Residents/Form', [
            'resident' => $resident,
            'familyCards' => FamilyCard::select('id', 'no_kk')->get(),
        ]);
    }

    public function update(Request $request, Resident $resident)
    {
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
            'status_penduduk' => 'required|in:aktif,meninggal,pindah,hilang',
        ]);

        $resident->update($validated);

        return redirect()->route('admin.residents.index')
            ->with('success', 'Data penduduk berhasil diperbarui.');
    }

    public function destroy(Resident $resident)
    {
        $resident->delete();

        return redirect()->route('admin.residents.index')
            ->with('success', 'Data penduduk berhasil dihapus.');
    }

    public function export()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\ResidentsExport, 'data_penduduk_' . date('Y-m-d_H-i') . '.xlsx');
    }
}
