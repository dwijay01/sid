<?php

namespace App\Http\Controllers\SieRukem;

use App\Http\Controllers\Controller;
use App\Models\RukemMember;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SieRukemDashboardController extends Controller
{
    public function index()
    {
        $totalAktif = RukemMember::where('status_keanggotaan', 'aktif')->count();
        $totalNonaktif = RukemMember::where('status_keanggotaan', 'nonaktif')->count();
        $totalKhusus = RukemMember::where('status_keanggotaan', 'khusus')->count();
        $totalKeluar = RukemMember::where('status_keanggotaan', 'keluar')->count();
        $totalTidakIkut = RukemMember::where('status_keanggotaan', 'tidak_ikut')->count();
        $total = RukemMember::count();

        $recentMembers = RukemMember::with('familyCard.kepalaKeluarga', 'familyCard.wilayah')
            ->whereIn('status_keanggotaan', ['aktif', 'khusus'])
            ->orderByDesc('created_at')
            ->take(10)
            ->get();

        return Inertia::render('SieRukem/Dashboard', [
            'stats' => [
                'total' => $total,
                'aktif' => $totalAktif,
                'nonaktif' => $totalNonaktif,
                'khusus' => $totalKhusus,
                'keluar' => $totalKeluar,
                'tidak_ikut' => $totalTidakIkut,
            ],
            'recentMembers' => $recentMembers,
        ]);
    }

    public function members(Request $request)
    {
        $members = RukemMember::with(['familyCard.kepalaKeluarga', 'familyCard.wilayah', 'familyCard.anggotaKeluarga'])
            ->when($request->search, function ($q, $search) {
                $q->whereHas('familyCard', fn($fc) => $fc->where('no_kk', 'like', "%{$search}%")
                    ->orWhereHas('kepalaKeluarga', fn($k) => $k->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('nik', 'like', "%{$search}%")));
            })
            ->when($request->status, fn($q, $status) => $q->where('status_keanggotaan', $status))
            ->when($request->rt, function ($q, $rt) {
                $q->whereHas('familyCard.wilayah', fn($q2) => $q2->where('rt', $rt));
            })
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('SieRukem/Members', [
            'members' => $members,
            'filters' => $request->only('search', 'status', 'rt'),
        ]);
    }
}
