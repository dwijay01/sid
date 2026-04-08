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
        $totalKeluar = RukemMember::where('status_keanggotaan', 'keluar')->count();
        $total = RukemMember::count();

        $recentMembers = RukemMember::with('resident.familyCard.wilayah')
            ->where('status_keanggotaan', 'aktif')
            ->orderByDesc('created_at')
            ->take(10)
            ->get();

        return Inertia::render('SieRukem/Dashboard', [
            'stats' => [
                'total' => $total,
                'aktif' => $totalAktif,
                'nonaktif' => $totalNonaktif,
                'keluar' => $totalKeluar,
            ],
            'recentMembers' => $recentMembers,
        ]);
    }

    public function members(Request $request)
    {
        $members = RukemMember::with('resident.familyCard.wilayah')
            ->when($request->search, function ($q, $search) {
                $q->whereHas('resident', fn($q2) => $q2->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%"));
            })
            ->when($request->status, fn($q, $status) => $q->where('status_keanggotaan', $status))
            ->when($request->rt, function ($q, $rt) {
                $q->whereHas('resident.familyCard.wilayah', fn($q2) => $q2->where('rt', $rt));
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
