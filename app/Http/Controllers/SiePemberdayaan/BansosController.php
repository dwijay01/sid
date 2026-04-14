<?php

namespace App\Http\Controllers\SiePemberdayaan;

use App\Http\Controllers\Controller;
use App\Models\FamilyCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BansosController extends Controller
{
    private function getManagedWilayahIds()
    {
        return auth()->user()->getManagedWilayahIds();
    }

    public function index(Request $request)
    {
        $wilayahIds = $this->getManagedWilayahIds();

        $families = FamilyCard::with(['wilayah', 'head'])
            ->whereIn('wilayah_id', $wilayahIds)
            // Filtering by housing condition criteria (example: non-permanent wall/floor)
            ->when($request->priority === 'high', function ($q) {
                $q->where(function($query) {
                    $query->where('jenis_lantai', 'not like', '%Keramik%')
                          ->orWhere('jenis_dinding', 'not like', '%Tembok%')
                          ->orWhere('fasilitas_sanitasi', 'not like', '%Pribadi%');
                });
            })
            ->when($request->search, function ($q, $search) {
                $q->where('no_kk', 'like', "%{$search}%")
                  ->orWhere('alamat', 'like', "%{$search}%");
            })
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('SiePemberdayaan/Bansos/Index', [
            'families' => $families,
            'filters' => $request->only('search', 'priority'),
        ]);
    }
}
