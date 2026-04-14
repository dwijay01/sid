<?php

namespace App\Http\Controllers\SiePemberdayaan;

use App\Http\Controllers\Controller;
use App\Models\ResidentSkill;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillController extends Controller
{
    private function getManagedWilayahIds()
    {
        return auth()->user()->getManagedWilayahIds();
    }

    public function index(Request $request)
    {
        $wilayahIds = $this->getManagedWilayahIds();

        $skills = ResidentSkill::with(['resident.familyCard.wilayah'])
            ->whereHas('resident.familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->when($request->search, function ($q, $search) {
                $q->where('skill_name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhereHas('resident', fn($r) => $r->where('nama_lengkap', 'like', "%{$search}%"));
            })
            ->when($request->category, fn($q, $cat) => $q->where('category', $cat))
            ->orderBy('skill_name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('SiePemberdayaan/Skills/Index', [
            'skills' => $skills,
            'filters' => $request->only('search', 'category'),
        ]);
    }

    public function create()
    {
        $wilayahIds = $this->getManagedWilayahIds();
        $residents = Resident::whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->orderBy('nama_lengkap')
            ->get(['id', 'nik', 'nama_lengkap']);

        return Inertia::render('SiePemberdayaan/Skills/Form', [
            'residents' => $residents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'category' => 'required|string|max:255',
            'skill_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        ResidentSkill::create($validated);

        return redirect()->route('sie-pemberdayaan.skills.index')
            ->with('success', 'Keahlian warga berhasil ditambahkan.');
    }

    public function edit(ResidentSkill $skill)
    {
        $wilayahIds = $this->getManagedWilayahIds();
        if (!in_array($skill->resident->familyCard->wilayah_id, $wilayahIds)) {
            abort(403);
        }

        $residents = Resident::whereHas('familyCard', fn($q) => $q->whereIn('wilayah_id', $wilayahIds))
            ->orderBy('nama_lengkap')
            ->get(['id', 'nik', 'nama_lengkap']);

        return Inertia::render('SiePemberdayaan/Skills/Form', [
            'skill' => $skill,
            'residents' => $residents,
        ]);
    }

    public function update(Request $request, ResidentSkill $skill)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'skill_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $skill->update($validated);

        return redirect()->route('sie-pemberdayaan.skills.index')
            ->with('success', 'Data keahlian berhasil diperbarui.');
    }

    public function destroy(ResidentSkill $skill)
    {
        $skill->delete();
        return redirect()->route('sie-pemberdayaan.skills.index')
            ->with('success', 'Data keahlian berhasil dihapus.');
    }
}
