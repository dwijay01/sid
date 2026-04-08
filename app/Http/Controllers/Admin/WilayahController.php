<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WilayahRtRw;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WilayahController extends Controller
{
    public function index(Request $request)
    {
        $wilayah = WilayahRtRw::with('ketua')
            ->withCount('familyCards')
            ->when($request->search, function ($q, $search) {
                $q->where('rt', 'like', "%{$search}%")
                  ->orWhere('rw', 'like', "%{$search}%")
                  ->orWhere('dusun', 'like', "%{$search}%")
                  ->orWhere('nama_ketua', 'like', "%{$search}%");
            })
            ->orderBy('rw')
            ->orderBy('rt')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Wilayah/Index', [
            'wilayah' => $wilayah,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        $rtRwUsers = User::role('rt')->get(['id', 'name']);

        return Inertia::render('Admin/Wilayah/Form', [
            'rtRwUsers' => $rtRwUsers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rt' => 'required|string|max:3',
            'rw' => 'required|string|max:3',
            'dusun' => 'nullable|string|max:100',
            'nama_ketua' => 'nullable|string|max:255',
            'ketua_user_id' => 'nullable|exists:users,id',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $validated['is_active'] ?? true;

        WilayahRtRw::create($validated);

        return redirect()->route('admin.wilayah.index')
            ->with('success', 'Data wilayah berhasil ditambahkan.');
    }

    public function edit(WilayahRtRw $wilayah)
    {
        $rtRwUsers = User::role('rt')->get(['id', 'name']);

        return Inertia::render('Admin/Wilayah/Form', [
            'wilayah' => $wilayah,
            'rtRwUsers' => $rtRwUsers,
        ]);
    }

    public function update(Request $request, WilayahRtRw $wilayah)
    {
        $validated = $request->validate([
            'rt' => 'required|string|max:3',
            'rw' => 'required|string|max:3',
            'dusun' => 'nullable|string|max:100',
            'nama_ketua' => 'nullable|string|max:255',
            'ketua_user_id' => 'nullable|exists:users,id',
            'is_active' => 'boolean',
        ]);

        $wilayah->update($validated);

        return redirect()->route('admin.wilayah.index')
            ->with('success', 'Data wilayah berhasil diperbarui.');
    }

    public function destroy(WilayahRtRw $wilayah)
    {
        if ($wilayah->familyCards()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Tidak dapat menghapus wilayah yang masih memiliki data Kartu Keluarga.');
        }

        $wilayah->delete();

        return redirect()->route('admin.wilayah.index')
            ->with('success', 'Data wilayah berhasil dihapus.');
    }
}
