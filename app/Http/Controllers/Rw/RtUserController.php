<?php

namespace App\Http\Controllers\Rw;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WilayahRtRw;
use Illuminate\Http\Request;
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

        return Inertia::render('Rw/ManageRtUsers', [
            'rtUsers' => $rtUsers,
            'wilayahList' => $wilayahList,
        ]);
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
