<?php

namespace App\Http\Controllers\RtRw;

use App\Http\Controllers\Controller;
use App\Models\LetterRequest;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RtRwDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        // Determine if user is RT or RW based on their profile data 
        // For simplicity we will assume they oversee the 'wilayah_id' linked to them
        // For now we get all requests missing RT approval
        $pendingApprovals = LetterRequest::with(['resident', 'letterType'])
            ->where('status', 'diajukan')
            // ->where('wilayah_id', $user->wilayah_id) // Example logic
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('RtRw/Dashboard', [
            'pendingApprovals' => $pendingApprovals,
            'stats' => [
                'menunggu_persetujuan' => $pendingApprovals->count(),
                'riwayat_disetujui' => LetterRequest::where('status', '!=', 'diajukan')->where('approved_by', auth()->id())->count(),
                'total_warga' => Resident::count(), // Should be filtered by wilayah in real app
            ]
        ]);
    }

    public function history()
    {
        $history = LetterRequest::with(['resident', 'letterType', 'logs'])
            ->where('approved_by', auth()->id())
            ->orderBy('updated_at', 'desc')
            ->paginate(15);
            
        return Inertia::render('RtRw/History', [
            'history' => $history
        ]);
    }

    public function residents()
    {
        $residents = Resident::with('familyCard')
            // ->where('wilayah_id', auth()->user()->wilayah_id)
            ->paginate(20);
            
        return Inertia::render('RtRw/MyResidents', [
            'residents' => $residents
        ]);
    }
}
