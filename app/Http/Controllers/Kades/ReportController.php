<?php

namespace App\Http\Controllers\Kades;

use App\Http\Controllers\Controller;
use App\Models\AuditTrail;
use App\Models\LetterRequest;
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
            'summary' => $this->demographyService->getSummary(),
        ];

        $chartData = [];
        foreach (['age', 'religion', 'education'] as $key) {
            $chartData[$key] = [];
            foreach ($demographics[$key] as $label => $value) {
                $chartData[$key][] = ['name' => $label, 'value' => $value];
            }
        }

        $chartData['gender'] = [
            ['name' => 'Laki-Laki', 'value' => $demographics['summary']['laki_laki']],
            ['name' => 'Perempuan', 'value' => $demographics['summary']['perempuan']],
        ];

        return Inertia::render('Kades/DemographyReport', [
            'chartData' => $chartData,
            'summary' => $demographics['summary'],
        ]);
    }

    public function letters(Request $request)
    {
        $year = $request->input('year', date('Y'));

        $monthlyStats = LetterRequest::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai"),
            )
            ->whereYear('created_at', $year)
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy('month')
            ->get();

        $summary = [
            'total' => LetterRequest::whereYear('created_at', $year)->count(),
            'selesai' => LetterRequest::whereYear('created_at', $year)->where('status', 'selesai')->count(),
            'pending' => LetterRequest::whereIn('status', ['diajukan', 'disetujui_rt', 'diproses_desa', 'menunggu_ttd_kades'])->count(),
        ];

        return Inertia::render('Kades/LetterReport', [
            'monthlyStats' => $monthlyStats,
            'summary' => $summary,
            'year' => (int) $year,
        ]);
    }

    public function audit(Request $request)
    {
        $audits = AuditTrail::with('user')
            ->when($request->search, function ($q, $search) {
                $q->where('auditable_type', 'like', "%{$search}%")
                  ->orWhere('event', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Kades/AuditTrail', [
            'audits' => $audits,
            'filters' => $request->only('search'),
        ]);
    }
}
