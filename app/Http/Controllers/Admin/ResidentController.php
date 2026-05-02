<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\FamilyCard;
use App\Models\WilayahRtRw;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ResidentImport;

class ResidentController extends Controller
{
    public function index(Request $request)
    {
        $query = Resident::with(['familyCard.wilayah', 'familyCard.rukemMember']);

        if ($request->sort === 'kk') {
            $query->leftJoin('family_cards', 'residents.family_card_id', '=', 'family_cards.id')
                ->select('residents.*')
                ->orderBy('family_cards.no_kk')
                ->orderByRaw("FIELD(hubungan_keluarga, 'kepala', 'istri', 'anak', 'menantu', 'cucu', 'orang_tua', 'mertua', 'famili_lain', 'lainnya')");
        } else {
            $query->orderBy('nama_lengkap');
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('residents.nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('residents.nik', 'like', '%' . $request->search . '%')
                  ->orWhere('residents.alamat_sekarang', 'like', '%' . $request->search . '%')
                  ->orWhereHas('familyCard', function($fc) use ($request) {
                      $fc->where('alamat', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->rt) {
            $query->whereHas('familyCard.wilayah', fn($q) => $q->where('rt', $request->rt));
        }

        if ($request->status) {
            $query->where('status_penduduk', $request->status);
        }

        $residents = $query->paginate(15)->withQueryString();

        $wilayahList = WilayahRtRw::select('id', 'rt', 'rw')->orderBy('rt')->get();

        $rukemStats = [
            'aktif' => Resident::where('status_penduduk', 'aktif')->whereHas('familyCard.rukemMember', fn($q) => $q->where('status_keanggotaan', 'aktif'))->count(),
            'khusus' => Resident::where('status_penduduk', 'aktif')->whereHas('familyCard.rukemMember', fn($q) => $q->where('status_keanggotaan', 'khusus'))->count(),
            'nonaktif' => Resident::where('status_penduduk', 'aktif')->whereHas('familyCard.rukemMember', fn($q) => $q->where('status_keanggotaan', 'nonaktif'))->count(),
        ];

        return Inertia::render('Admin/Residents/Index', [
            'residents' => $residents,
            'filters' => $request->only('search', 'sort', 'rt', 'status'),
            'wilayahList' => $wilayahList,
            'rukemStats' => $rukemStats,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Residents/Form', [
            'familyCards' => FamilyCard::with('kepalaKeluarga:id,nama_lengkap')->select('id', 'no_kk', 'kepala_keluarga_id')->get(),
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
            'familyCards' => FamilyCard::with('kepalaKeluarga:id,nama_lengkap')->select('id', 'no_kk', 'kepala_keluarga_id')->get(),
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
        return Excel::download(new \App\Exports\ResidentsExport, 'data_penduduk_' . date('Y-m-d_H-i') . '.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
            'duplicate_action' => 'nullable|in:skip,update',
        ]);

        $file = $request->file('file');
        
        try {
            $import = new ResidentImport(null, null, $request->duplicate_action ?? 'skip');
            Excel::import($import, $file);

            $successCount = $import->getSuccessCount();
            $skipped = $import->getSkipped();
            
            $summary = ["Total Berhasil: $successCount", "Total Dilewati: " . count($skipped)];

            $message = "Import selesai. Total: $successCount Berhasil, " . count($skipped) . " Dilewati.";
            
            \App\Models\ImportLog::create([
                'user_id' => auth()->id(),
                'filename' => $file->getClientOriginalName(),
                'total_success' => $successCount,
                'total_skipped' => count($skipped),
                'details' => [
                    'summary' => $summary,
                    'skipped_details' => $skipped
                ],
                'type' => 'resident_admin',
            ]);

            return back()->with([
                'success' => $message,
                'import_results' => [
                    'summary' => $summary,
                    'total_success' => $successCount,
                    'total_skipped' => count($skipped),
                    'skipped_details' => $skipped
                ]
            ]);

        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengimpor data: ' . $e->getMessage());
        }
    }
}
