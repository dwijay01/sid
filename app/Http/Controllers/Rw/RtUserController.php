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
            ->where(function($q) use ($rw) {
                $q->whereHas('managedWilayah', fn($sq) => $sq->where('rw', $rw))
                  ->orWhereHas('wilayah', fn($sq) => $sq->where('rw', $rw));
            })
            ->with(['managedWilayah', 'wilayah'])
            ->get();

        $pendingRtUsers = User::role('rt')
            ->where('is_active', false)
            ->whereHas('pendingWilayah', fn($q) => $q->where('rw', $rw))
            ->with('pendingWilayah')
            ->get();

        $rukemUsers = User::role('sie_rukem')
            ->whereHas('wilayah', fn($sq) => $sq->where('rw', $rw))
            ->with('wilayah')
            ->get();

        $pemberdayaanUsers = User::role('sie_pemberdayaan')
            ->whereHas('wilayah', fn($sq) => $sq->where('rw', $rw))
            ->with('wilayah')
            ->get();

        return Inertia::render('Rw/ManageRtUsers', [
            'rtUsers' => $rtUsers,
            'pendingRtUsers' => $pendingRtUsers,
            'wilayahList' => $wilayahList,
            'rukemUsers' => $rukemUsers,
            'pemberdayaanUsers' => $pemberdayaanUsers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|in:rt,sie_rukem,sie_pemberdayaan',
            'wilayah_id' => 'required_if:role,rt|nullable|exists:wilayah_rt_rw,id',
        ]);

        $rwWilayah = auth()->user()->managedWilayah ?: auth()->user()->wilayah;
        $targetWilayahId = $validated['role'] === 'rt' ? $validated['wilayah_id'] : $rwWilayah?->id;

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_active' => true,
            'wilayah_id' => $targetWilayahId,
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

        return back()->with('success', 'Akun ' . ($validated['role'] === 'rt' ? 'Ketua RT' : ($validated['role'] === 'sie_rukem' ? 'Sie Rukem' : 'Sie Pemberdayaan')) . ' berhasil dibuat.');
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

    public function approve(User $user)
    {
        $rw = $this->getRw();
        $pendingWilayah = $user->pendingWilayah;

        if (!$pendingWilayah || $pendingWilayah->rw !== $rw) {
            return back()->with('error', 'Permohonan tidak valid.');
        }

        // Update Wilayah
        $pendingWilayah->update([
            'ketua_user_id' => $user->id,
            'nama_ketua' => $user->name,
        ]);

        // Update User
        $user->update([
            'is_active' => true,
            'wilayah_id' => $pendingWilayah->id,
            'pending_wilayah_id' => null,
        ]);

        return back()->with('success', "Akun {$user->name} telah diaktifkan sebagai Ketua RT {$pendingWilayah->rt}.");
    }

    public function reject(User $user)
    {
        $rw = $this->getRw();
        $pendingWilayah = $user->pendingWilayah;

        if (!$pendingWilayah || $pendingWilayah->rw !== $rw) {
            return back()->with('error', 'Permohonan tidak valid.');
        }

        // We delete the user account if rejected to allow them to re-register with same email?
        // Or just clear the pending? User wants accounts to be activated.
        // I'll delete the user to keep the database clean of failed registrations.
        $user->delete();

        return back()->with('success', 'Permohonan akun telah ditolak dan dihapus.');
    }
}
