<?php

namespace App\Http\Controllers\Rt;

use App\Http\Controllers\Controller;
use App\Models\FamilyCard;
use App\Models\LetterRequest;
use App\Models\PopulationMutation;
use App\Models\Resident;
use App\Models\RukemMember;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\ReportExport;
use Maatwebsite\Excel\Facades\Excel;

class RtDashboardController extends Controller
{
    /**
     * Get wilayah ID for the current RT user.
     */
    private function getWilayahId()
    {
        $wilayah = auth()->user()->managedWilayah;
        return $wilayah?->id;
    }

    public function index()
    {
        $wilayahId = $this->getWilayahId();

        $totalPenduduk = Resident::whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->where('status_penduduk', 'aktif')->count();

        $totalKK = FamilyCard::where('wilayah_id', $wilayahId)->where('status', 'aktif')->count();

        $totalRukem = RukemMember::where('status_keanggotaan', 'aktif')
            ->whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->count();

        $recentMutations = PopulationMutation::with('resident')
            ->whereHas('resident.familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->orderByDesc('tanggal_mutasi')
            ->take(5)
            ->get();

        return Inertia::render('Rt/Dashboard', [
            'stats' => [
                'total_penduduk' => $totalPenduduk,
                'total_kk' => $totalKK,
                'total_rukem' => $totalRukem,
                'total_umkm' => Umkm::where('status', 'aktif')
                    ->whereHas('resident.familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
                    ->count(),
            ],
            'recentMutations' => $recentMutations,
        ]);
    }

    public function residents(Request $request)
    {
        $wilayahId = $this->getWilayahId();

        $query = Resident::with('familyCard.wilayah')
            ->whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId));

        if ($request->sort === 'kk') {
            $query->leftJoin('family_cards', 'residents.family_card_id', '=', 'family_cards.id')
                ->select('residents.*')
                ->orderBy('family_cards.no_kk')
                ->orderByRaw("FIELD(hubungan_keluarga, 'kepala', 'istri', 'anak', 'menantu', 'cucu', 'orang_tua', 'mertua', 'famili_lain', 'lainnya')");
        } else {
            $query->orderBy('nama_lengkap');
        }

        $residents = $query->when($request->search, function ($q, $search) {
                $q->where(function($sq) use ($search) {
                    $sq->where('residents.nama_lengkap', 'like', "%{$search}%")
                      ->orWhere('residents.nik', 'like', "%{$search}%")
                      ->orWhere('residents.alamat_sekarang', 'like', "%{$search}%")
                      ->orWhereHas('familyCard', function($fc) use ($search) {
                          $fc->where('alamat', 'like', "%{$search}%");
                      });
                });
            })
            ->when($request->status, function ($q, $status) {
                $q->where('residents.status_penduduk', $status);
            })
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Rt/Residents/Index', [
            'residents' => $residents,
            'filters' => $request->only('search', 'status', 'sort'),
        ]);
    }

    public function reports(Request $request)
    {
        $wilayahId = $this->getWilayahId();
        $type = $request->input('type', 'penduduk');

        $data = [];

        switch ($type) {
            case 'penduduk':
                $data = Resident::with('familyCard.wilayah')
                    ->whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
                    ->where('status_penduduk', 'aktif')
                    ->orderBy('nama_lengkap')
                    ->get();
                break;
            case 'rukem':
                $data = RukemMember::with('familyCard.kepalaKeluarga', 'familyCard.wilayah')
                    ->whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
                    ->where('status_keanggotaan', 'aktif')
                    ->get();
                break;
            case 'pindah':
                $data = PopulationMutation::with('resident.familyCard.wilayah')
                    ->whereHas('resident.familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
                    ->where('type', 'pindah_keluar')
                    ->orderByDesc('tanggal_mutasi')
                    ->get();
                break;
            case 'masuk':
                $data = PopulationMutation::with('resident.familyCard.wilayah')
                    ->whereHas('resident.familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
                    ->whereIn('type', ['pindah_masuk', 'datang'])
                    ->orderByDesc('tanggal_mutasi')
                    ->get();
                break;
            case 'meninggal':
                $data = PopulationMutation::with('resident.familyCard.wilayah')
                    ->whereHas('resident.familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
                    ->where('type', 'mati')
                    ->orderByDesc('tanggal_mutasi')
                    ->get();
                break;
            case 'lahir':
                $data = PopulationMutation::with('resident.familyCard.wilayah')
                    ->whereHas('resident.familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
                    ->where('type', 'lahir')
                    ->orderByDesc('tanggal_mutasi')
                    ->get();
                break;
        }

        if ($request->input('export') === 'excel') {
            return Excel::download(new ReportExport($data, $type), 'Report_RT_' . ucfirst($type) . '_' . date('Ymd') . '.xlsx');
        }

        return Inertia::render('Rt/Reports', [
            'data' => $data,
            'type' => $type,
        ]);
    }
}
