<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\LetterRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if (!$user->resident_id) {
            return redirect()->route('profile.edit')->with('warning', 'Silakan lengkapi profil kependudukan Anda terlebih dahulu.');
        }

        $activeRequests = LetterRequest::with('letterType')
            ->where('subject_resident_id', $user->resident_id)
            ->whereNotIn('status', [LetterRequest::STATUS_SELESAI, LetterRequest::STATUS_DITOLAK])
            ->orderBy('created_at', 'desc')
            ->get();

        $recentHistory = LetterRequest::with('letterType')
            ->where('subject_resident_id', $user->resident_id)
            ->whereIn('status', [LetterRequest::STATUS_SELESAI, LetterRequest::STATUS_DITOLAK])
            ->orderBy('updated_at', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('Warga/Dashboard', [
            'activeRequests' => $activeRequests,
            'recentHistory' => $recentHistory,
        ]);
    }
}
