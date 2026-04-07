<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LetterTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LetterTemplateController extends Controller
{
    public function index(Request $request)
    {
        $templates = LetterTemplate::with('creator')
            ->withCount('letterTypes')
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Templates/Index', [
            'templates' => $templates,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Templates/Editor');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'body_template' => 'required|string',
            'footer_text' => 'nullable|string|max:1000',
        ]);

        $validated['created_by'] = auth()->id();

        if ($request->hasFile('kop_surat')) {
            $validated['kop_surat_path'] = $request->file('kop_surat')->store('kop-surat', 'public');
        }

        LetterTemplate::create($validated);

        return redirect()->route('admin.letter-templates.index')
            ->with('success', 'Template surat berhasil dibuat.');
    }

    public function show(LetterTemplate $letterTemplate)
    {
        $letterTemplate->load(['creator', 'letterTypes']);

        return Inertia::render('Admin/Templates/Editor', [
            'template' => $letterTemplate,
            'readOnly' => true,
        ]);
    }

    public function edit(LetterTemplate $letterTemplate)
    {
        return Inertia::render('Admin/Templates/Editor', [
            'template' => $letterTemplate,
        ]);
    }

    public function update(Request $request, LetterTemplate $letterTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'body_template' => 'required|string',
            'footer_text' => 'nullable|string|max:1000',
        ]);

        if ($request->hasFile('kop_surat')) {
            $validated['kop_surat_path'] = $request->file('kop_surat')->store('kop-surat', 'public');
        }

        $letterTemplate->update($validated);

        return redirect()->route('admin.letter-templates.index')
            ->with('success', 'Template surat berhasil diperbarui.');
    }

    public function destroy(LetterTemplate $letterTemplate)
    {
        if ($letterTemplate->letterTypes()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Template ini masih digunakan oleh jenis surat.');
        }

        $letterTemplate->delete();

        return redirect()->route('admin.letter-templates.index')
            ->with('success', 'Template surat berhasil dihapus.');
    }
}
