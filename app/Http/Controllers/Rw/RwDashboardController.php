<?php

namespace App\Http\Controllers\Rw;

use App\Http\Controllers\Controller;
use App\Models\FamilyCard;
use App\Models\LetterRequest;
use App\Models\PopulationMutation;
use App\Models\Resident;
use App\Models\RukemMember;
use App\Models\Umkm;
use App\Models\WilayahRtRw;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RwDashboardController extends Controller
{
    /**
     * Get wilayah IDs under this RW.
     */
    private function getWilayahIds()
    {
        return auth()->user()->getManagedWilayahIds();
    }

    public function index()
    {
        $wilayahIds = $this->getWilayahIds();

        $totalPenduduk = Resident::whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->where('status_penduduk', 'aktif')->count();

        $totalRukem = RukemMember::where('status_keanggotaan', 'aktif')
            ->whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->count();

        $totalKK = FamilyCard::whereIn('wilayah_id', $wilayahIds)->where('status', 'aktif')->count();

        $totalRT = WilayahRtRw::whereIn('id', $wilayahIds)->count();

        $recentMutations = PopulationMutation::with('resident')
            ->whereHas('resident.familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->orderByDesc('tanggal_mutasi')
            ->take(5)
            ->get();

        return Inertia::render('Rw/Dashboard', [
            'stats' => [
                'total_penduduk' => $totalPenduduk,
                'total_rukem' => $totalRukem,
                'total_kk' => $totalKK,
                'total_rt' => $totalRT,
                'total_umkm' => Umkm::where('status', 'aktif')
                    ->whereHas('resident.familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
                    ->count(),
            ],
            'recentMutations' => $recentMutations,
        ]);
    }

    public function residents(Request $request)
    {
        $wilayahIds = $this->getWilayahIds();

        $residents = Resident::with('familyCard.wilayah')
            ->whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->when($request->search, function ($q, $search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            })
            ->when($request->rt, function ($q, $rt) {
                $q->whereHas('familyCard.wilayah', fn($q2) => $q2->where('rt', $rt));
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status_penduduk', $status);
            })
            ->orderBy('nama_lengkap')
            ->paginate(20)
            ->withQueryString();

        $wilayahList = WilayahRtRw::whereIn('id', $wilayahIds)->get(['id', 'rt', 'rw']);

        return Inertia::render('Rw/Residents', [
            'residents' => $residents,
            'filters' => $request->only('search', 'rt', 'status'),
            'wilayahList' => $wilayahList,
        ]);
    }

    public function rukemMembers(Request $request)
    {
        $wilayahIds = $this->getWilayahIds();

        $members = RukemMember::with('familyCard.kepalaKeluarga', 'familyCard.wilayah')
            ->whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->when($request->search, function ($q, $search) {
                $q->whereHas('familyCard', fn($fc) => $fc->where('no_kk', 'like', "%{$search}%")
                    ->orWhereHas('kepalaKeluarga', fn($k) => $k->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('nik', 'like', "%{$search}%")));
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status_keanggotaan', $status);
            })
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Rw/RukemMembers', [
            'members' => $members,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function umkm(Request $request)
    {
        $wilayahIds = $this->getWilayahIds();

        $umkm = Umkm::with('resident.familyCard.wilayah')
            ->whereHas('resident.familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->when($request->search, function ($q, $search) {
                $q->where('nama_usaha', 'like', "%{$search}%")
                  ->orWhereHas('resident', fn($r) => $r->where('nama_lengkap', 'like', "%{$search}%"));
            })
            ->when($request->sektor, fn($q, $sektor) => $q->where('sektor_usaha', $sektor))
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->rt, function ($q, $rt) {
                $q->whereHas('resident.familyCard.wilayah', fn($q2) => $q2->where('rt', $rt));
            })
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Rw/Umkm', [
            'umkm' => $umkm,
            'filters' => $request->only('search', 'sektor', 'status', 'rt'),
        ]);
    }

    public function reports(Request $request)
    {
        $wilayahIds = $this->getWilayahIds();
        $type = $request->input('type', 'penduduk');

        $data = [];

        switch ($type) {
            case 'penduduk':
                $data = Resident::with('familyCard.wilayah')
                    ->whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
                    ->where('status_penduduk', 'aktif')
                    ->orderBy('nama_lengkap')
                    ->get();
                break;
            case 'rukem':
                $data = RukemMember::with('familyCard.kepalaKeluarga', 'familyCard.wilayah')
                    ->whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
                    ->where('status_keanggotaan', 'aktif')
                    ->get();
                break;
            case 'pindah':
                $data = PopulationMutation::with('resident.familyCard.wilayah')
                    ->whereHas('resident.familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
                    ->where('type', 'pindah_keluar')
                    ->orderByDesc('tanggal_mutasi')
                    ->get();
                break;
            case 'masuk':
                $data = PopulationMutation::with('resident.familyCard.wilayah')
                    ->whereHas('resident.familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
                    ->whereIn('type', ['pindah_masuk', 'datang'])
                    ->orderByDesc('tanggal_mutasi')
                    ->get();
                break;
            case 'meninggal':
                $data = PopulationMutation::with('resident.familyCard.wilayah')
                    ->whereHas('resident.familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
                    ->where('type', 'mati')
                    ->orderByDesc('tanggal_mutasi')
                    ->get();
                break;
            case 'lahir':
                $data = PopulationMutation::with('resident.familyCard.wilayah')
                    ->whereHas('resident.familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
                    ->where('type', 'lahir')
                    ->orderByDesc('tanggal_mutasi')
                    ->get();
                break;
        }

        return Inertia::render('Rw/Reports', [
            'data' => $data,
            'type' => $type,
        ]);
    }

    public function letters(Request $request)
    {
        $wilayahIds = $this->getWilayahIds();

        $letters = LetterRequest::with(['resident', 'letterType', 'pemohon'])
            ->whereIn('wilayah_id', $wilayahIds)
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Rw/Letters', [
            'letters' => $letters,
            'filters' => $request->only('status'),
        ]);
    }
}
