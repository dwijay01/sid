<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use App\Models\FamilyCard;
use App\Models\VillageSetting;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function index()
    {
        // Village settings
        $general = VillageSetting::getGroup('general');
        $landing = VillageSetting::getGroup('landing');

        // Population statistics
        $totalPenduduk = Resident::count();
        $lakiLaki = Resident::where('jenis_kelamin', 'L')->count();
        $perempuan = Resident::where('jenis_kelamin', 'P')->count();
        $totalKK = FamilyCard::count();

        return Inertia::render('Welcome', [
            'desa' => $general,
            'landing' => $landing,
            'statistik' => [
                'total_penduduk' => $totalPenduduk,
                'laki_laki' => $lakiLaki,
                'perempuan' => $perempuan,
                'total_kk' => $totalKK,
            ],
        ]);
    }
}
