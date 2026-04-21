<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FamilyController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        if (!$user->resident_id) {
            return redirect()->route('profile.edit')->with('warning', 'Silakan lengkapi profil Anda terlebih dahulu.');
        }

        $resident = $user->resident()->with(['familyCard', 'familyCard.anggotaKeluarga'])->first();

        if (!$resident->familyCard) {
            return Inertia::render('Warga/FamilyProfile', [
                'familyCard' => null,
                'members' => [],
            ]);
        }

        return Inertia::render('Warga/FamilyProfile', [
            'familyCard' => $resident->familyCard,
            'members' => $resident->familyCard->anggotaKeluarga,
        ]);
    }
}
