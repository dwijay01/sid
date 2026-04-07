<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VillageSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = VillageSetting::all()->groupBy('group');

        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
            'settings.*.group' => 'required|string',
        ]);

        foreach ($validated['settings'] as $setting) {
            VillageSetting::setValue(
                $setting['key'],
                $setting['value'],
                $setting['group']
            );
        }

        return redirect()->route('admin.settings.index')
            ->with('success', 'Pengaturan berhasil diperbarui.');
    }

    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'key' => 'required|string',
        ]);

        $file = $request->file('file');
        $filename = $request->key . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('landing', $filename, 'public');

        VillageSetting::setValue($request->key, '/storage/' . $path, 'landing');

        return back()->with('success', 'Foto berhasil diupload.');
    }
}
