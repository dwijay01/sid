<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LetterType;
use App\Models\LetterTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LetterTypeController extends Controller
{
    public function index(Request $request)
    {
        $letterTypes = LetterType::with('template')
            ->withCount('letterRequests')
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/LetterTypes/Index', [
            'letterTypes' => $letterTypes,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        $templates = LetterTemplate::all(['id', 'name']);

        return Inertia::render('Admin/LetterTypes/Form', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:letter_types,code',
            'description' => 'nullable|string|max:1000',
            'template_id' => 'nullable|exists:letter_templates,id',
            'requires_rt_approval' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $validated['requires_rt_approval'] = $validated['requires_rt_approval'] ?? true;
        $validated['is_active'] = $validated['is_active'] ?? true;

        LetterType::create($validated);

        return redirect()->route('admin.letter-types.index')
            ->with('success', 'Jenis surat berhasil ditambahkan.');
    }

    public function edit(LetterType $letterType)
    {
        $templates = LetterTemplate::all(['id', 'name']);

        return Inertia::render('Admin/LetterTypes/Form', [
            'letterType' => $letterType,
            'templates' => $templates,
        ]);
    }

    public function update(Request $request, LetterType $letterType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:letter_types,code,' . $letterType->id,
            'description' => 'nullable|string|max:1000',
            'template_id' => 'nullable|exists:letter_templates,id',
            'requires_rt_approval' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $letterType->update($validated);

        return redirect()->route('admin.letter-types.index')
            ->with('success', 'Jenis surat berhasil diperbarui.');
    }

    public function destroy(LetterType $letterType)
    {
        if ($letterType->letterRequests()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Jenis surat ini masih memiliki permohonan terkait.');
        }

        $letterType->delete();

        return redirect()->route('admin.letter-types.index')
            ->with('success', 'Jenis surat berhasil dihapus.');
    }
}
