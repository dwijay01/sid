<?php

namespace App\Http\Controllers\SiePemberdayaan;

use App\Http\Controllers\Controller;
use App\Models\WasteParticipation;
use App\Models\FamilyCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WasteController extends Controller
{
    private function getManagedWilayahIds()
    {
        return auth()->user()->getManagedWilayahIds();
    }

    public function index(Request $request)
    {
        $wilayahIds = $this->getManagedWilayahIds();

        $participations = WasteParticipation::with(['familyCard.wilayah', 'familyCard.head'])
            ->whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->when($request->search, function ($q, $search) {
                $q->whereHas('familyCard', fn($f) => $f->where('no_kk', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%"));
            })
            ->when($request->status !== null, fn($q) => $q->where('is_active', $request->status === 'active'))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('SiePemberdayaan/Waste/Index', [
            'participations' => $participations,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function create()
    {
        $wilayahIds = $this->getManagedWilayahIds();
        $familyCards = FamilyCard::with(['kepalaKeluarga', 'wilayah'])
            ->whereIn('wilayah_id', $wilayahIds)
            ->whereDoesntHave('wasteParticipation')
            ->get();

        return Inertia::render('SiePemberdayaan/Waste/Form', [
            'familyCards' => $familyCards,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'family_card_id' => 'required|exists:family_cards,id|unique:waste_participations,family_card_id',
            'is_active' => 'required|boolean',
            'balance' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        WasteParticipation::create($validated);

        return redirect()->route('sie-pemberdayaan.waste.index')
            ->with('success', 'Partisipasi bank sampah berhasil didaftarkan.');
    }

    public function edit(WasteParticipation $waste)
    {
        $wilayahIds = $this->getManagedWilayahIds();
        if (!in_array($waste->familyCard->wilayah_id, $wilayahIds)) {
            abort(403);
        }

        return Inertia::render('SiePemberdayaan/Waste/Form', [
            'participation' => $waste,
        ]);
    }

    public function update(Request $request, WasteParticipation $waste)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
            'balance' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $waste->update($validated);

        return redirect()->route('sie-pemberdayaan.waste.index')
            ->with('success', 'Data partisipasi berhasil diperbarui.');
    }
}
