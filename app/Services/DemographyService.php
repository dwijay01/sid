<?php

namespace App\Services;

use App\Models\Resident;
use App\Models\FamilyCard;
use Illuminate\Support\Facades\DB;

class DemographyService
{
    /**
     * Get basic summary statistics for the dashboard.
     */
    public function getSummary()
    {
        return [
            'total_penduduk' => Resident::where('status_penduduk', 'aktif')->count(),
            'total_kk' => FamilyCard::where('status', 'aktif')->count(),
            'laki_laki' => Resident::where('status_penduduk', 'aktif')->where('jenis_kelamin', 'L')->count(),
            'perempuan' => Resident::where('status_penduduk', 'aktif')->where('jenis_kelamin', 'P')->count(),
        ];
    }

    /**
     * Get age demographics data.
     */
    public function getAgeDemographics()
    {
        $residents = Resident::where('status_penduduk', 'aktif')->get(['tanggal_lahir']);
        
        $groups = [
            '0-5' => 0,
            '6-12' => 0,
            '13-18' => 0,
            '19-35' => 0,
            '36-55' => 0,
            '56+' => 0,
        ];

        foreach ($residents as $resident) {
            $age = $resident->usia; // uses the getUsiaAttribute() accessor

            if ($age <= 5) $groups['0-5']++;
            elseif ($age <= 12) $groups['6-12']++;
            elseif ($age <= 18) $groups['13-18']++;
            elseif ($age <= 35) $groups['19-35']++;
            elseif ($age <= 55) $groups['36-55']++;
            else $groups['56+']++;
        }

        return $groups;
    }

    /**
     * Get demographics by religion.
     */
    public function getReligionDemographics()
    {
        return Resident::select('agama', DB::raw('count(*) as total'))
            ->where('status_penduduk', 'aktif')
            ->groupBy('agama')
            ->get()
            ->pluck('total', 'agama');
    }

    /**
     * Get total active residents.
     */
    public function getTotalResidents(): int
    {
        return Resident::where('status_penduduk', 'aktif')->count();
    }

    /**
     * Get demographics by education level.
     */
    public function getEducationDemographics()
    {
        return Resident::select('pendidikan', DB::raw('count(*) as total'))
            ->where('status_penduduk', 'aktif')
            ->whereNotNull('pendidikan')
            ->groupBy('pendidikan')
            ->get()
            ->pluck('total', 'pendidikan');
    }

    /**
     * Get demographics by occupation.
     */
    public function getOccupationDemographics()
    {
        return Resident::select('pekerjaan', DB::raw('count(*) as total'))
            ->where('status_penduduk', 'aktif')
            ->whereNotNull('pekerjaan')
            ->groupBy('pekerjaan')
            ->orderByDesc('total')
            ->limit(15)
            ->get()
            ->pluck('total', 'pekerjaan');
    }
}
