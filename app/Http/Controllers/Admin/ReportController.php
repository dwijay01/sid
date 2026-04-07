<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LetterRequest;
use App\Models\Resident;
use App\Models\PopulationMutation;
use App\Services\DemographyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    protected $demographyService;

    public function __construct(DemographyService $demographyService)
    {
        $this->demographyService = $demographyService;
    }

    public function demography()
    {
        $demographics = [
            'age' => $this->demographyService->getAgeDemographics(),
            'religion' => $this->demographyService->getReligionDemographics(),
            'education' => $this->demographyService->getEducationDemographics(),
            'occupation' => $this->demographyService->getOccupationDemographics(),
            'summary' => $this->demographyService->getSummary(),
        ];

        // Format chart data
        $chartData = [];
        foreach (['age', 'religion', 'education', 'occupation'] as $key) {
            $chartData[$key] = [];
            foreach ($demographics[$key] as $label => $value) {
                $chartData[$key][] = ['name' => $label, 'value' => $value];
            }
        }

        $chartData['gender'] = [
            ['name' => 'Laki-Laki', 'value' => $demographics['summary']['laki_laki']],
            ['name' => 'Perempuan', 'value' => $demographics['summary']['perempuan']],
        ];

        return Inertia::render('Admin/Reports/Demography', [
            'chartData' => $chartData,
            'summary' => $demographics['summary'],
        ]);
    }

    public function letters(Request $request)
    {
        $year = $request->input('year', date('Y'));

        // Monthly letter stats
        $monthlyStats = LetterRequest::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai"),
                DB::raw("SUM(CASE WHEN status IN ('ditolak_rt','ditolak') THEN 1 ELSE 0 END) as ditolak"),
            )
            ->whereYear('created_at', $year)
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy('month')
            ->get();

        // By type stats
        $byType = LetterRequest::select('letter_type_id', DB::raw('COUNT(*) as total'))
            ->with('letterType:id,name,code')
            ->whereYear('created_at', $year)
            ->groupBy('letter_type_id')
            ->get();

        return Inertia::render('Admin/Reports/LetterStats', [
            'monthlyStats' => $monthlyStats,
            'byType' => $byType,
            'year' => (int) $year,
            'availableYears' => LetterRequest::selectRaw('DISTINCT YEAR(created_at) as year')
                ->orderByDesc('year')->pluck('year'),
        ]);
    }
}
