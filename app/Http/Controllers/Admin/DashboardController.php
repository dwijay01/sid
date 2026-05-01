<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Inertia\Inertia;
class DashboardController extends Controller
{
    protected $demographyService;

    public function __construct(\App\Services\DemographyService $demographyService)
    {
        $this->demographyService = $demographyService;
    }

    public function index()
    {
        $demographics = [
            'age' => $this->demographyService->getAgeDemographics(),
            'religion' => $this->demographyService->getReligionDemographics(),
            'summary' => $this->demographyService->getSummary(),
        ];

        // Format data for Recharts
        $ageChartData = [];
        foreach ($demographics['age'] as $range => $count) {
            $ageChartData[] = ['name' => $range, 'value' => $count];
        }

        $religionChartData = [];
        foreach ($demographics['religion'] as $religion => $count) {
            $religionChartData[] = ['name' => $religion, 'value' => $count];
        }

        $genderChartData = [
            ['name' => 'Laki-Laki', 'value' => $demographics['summary']['laki_laki']],
            ['name' => 'Perempuan', 'value' => $demographics['summary']['perempuan']],
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_penduduk' => $demographics['summary']['total_penduduk'],
                'total_kk' => $demographics['summary']['total_kk'],
                'total_umkm' => Umkm::where('status', 'aktif')->whereHas('resident', fn($q) => $q->where('status_penduduk', 'aktif'))->count(),
                'surat_pending' => \App\Models\LetterRequest::where('status', 'menunggu_review_admin')->count(),
                'surat_selesai' => \App\Models\LetterRequest::where('status', 'selesai')->count(),
            ],
            'chartData' => [
                'age' => $ageChartData,
                'religion' => $religionChartData,
                'gender' => $genderChartData,
            ]
        ]);
    }
}
