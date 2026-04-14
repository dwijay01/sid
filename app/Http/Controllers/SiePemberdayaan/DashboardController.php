<?php

namespace App\Http\Controllers\SiePemberdayaan;

use App\Http\Controllers\Controller;
use App\Models\FamilyCard;
use App\Models\InternetSubscription;
use App\Models\InternetPayment;
use App\Models\ResidentSkill;
use App\Models\WasteParticipation;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getManagedWilayahIds()
    {
        return auth()->user()->getManagedWilayahIds();
    }

    public function index()
    {
        $wilayahIds = $this->getManagedWilayahIds();

        $stats = [
            'total_families' => FamilyCard::whereIn('wilayah_id', $wilayahIds)->count(),
            'total_residents' => Resident::whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))->count(),
            'internet_active' => InternetSubscription::whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
                ->where('status', 'aktif')->count(),
            'total_skills' => ResidentSkill::whereHas('resident.familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))->count(),
            'waste_active' => WasteParticipation::whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
                ->where('is_active', true)->count(),
        ];

        // Recent payments
        $recentPayments = InternetPayment::with('subscription.familyCard')
            ->whereHas('subscription.familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->orderByDesc('payment_date')
            ->limit(5)
            ->get();

        return Inertia::render('SiePemberdayaan/Dashboard', [
            'stats' => $stats,
            'recentPayments' => $recentPayments,
        ]);
    }
}
