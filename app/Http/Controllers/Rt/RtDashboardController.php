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

        $residents = Resident::with('familyCard.wilayah')
            ->whereHas('familyCard', fn($q) => $q->where('wilayah_id', $wilayahId))
            ->when($request->search, function ($q, $search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status_penduduk', $status);
            })
            ->orderBy('nama_lengkap')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Rt/Residents/Index', [
            'residents' => $residents,
            'filters' => $request->only('search', 'status'),
        ]);
    }
}
