<?php

namespace App\Http\Controllers\Rw;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WilayahRtRw;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class RtUserController extends Controller
{
    /**
     * Get the RW number for the current user.
     */
    private function getRw(): ?string
    {
        $wilayah = auth()->user()->managedWilayah;
        return $wilayah?->rw;
    }

    public function index()
    {
        $rw = $this->getRw();

        $wilayahList = WilayahRtRw::where('rw', $rw)
            ->with('ketua')
            ->get();

        $rtUsers = User::role('rt')
            ->whereHas('managedWilayah', fn($q) => $q->where('rw', $rw))
            ->with('managedWilayah')
            ->get();

        $rukemUsers = User::role('sie_rukem')->get();

        return Inertia::render('Rw/ManageRtUsers', [
            'rtUsers' => $rtUsers,
            'wilayahList' => $wilayahList,
            'rukemUsers' => $rukemUsers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|in:rt,sie_rukem',
            'wilayah_id' => 'required_if:role,rt|nullable|exists:wilayah_rt_rw,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_active' => true,
        ]);

        $user->assignRole($validated['role']);

        if ($validated['role'] === 'rt' && !empty($validated['wilayah_id'])) {
            $wilayah = WilayahRtRw::find($validated['wilayah_id']);
            if ($wilayah && $wilayah->rw === $this->getRw()) {
                $wilayah->update([
                    'ketua_user_id' => $user->id,
                    'nama_ketua' => $user->name,
                ]);
            }
        }

        return back()->with('success', 'Akun ' . ($validated['role'] === 'rt' ? 'Ketua RT' : 'Sie Rukem') . ' berhasil dibuat.');
    }

    public function toggleActive(User $user)
    {
        // Ensure the user is RT and within same RW
        $rw = $this->getRw();
        $userWilayah = $user->managedWilayah;

        if (!$userWilayah || $userWilayah->rw !== $rw) {
            return back()->with('error', 'User bukan RT di RW Anda.');
        }

        $user->update(['is_active' => !$user->is_active]);

        return back()->with('success', 'Status akses RT berhasil diperbarui.');
    }
}
