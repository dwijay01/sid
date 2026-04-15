<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WilayahRtRw;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with(['roles', 'wilayah'])
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            })
            ->when($request->role, function ($q, $role) {
                $q->role($role);
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        // Append role name as plain string
        $users->getCollection()->transform(function ($user) {
            $user->role_name = $user->roles->first()?->name ?? 'warga';
            return $user;
        });

        $roles = Role::all(['id', 'name']);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only('search', 'role'),
        ]);
    }

    public function create()
    {
        $roles = Role::all(['id', 'name']);
        $wilayah = WilayahRtRw::all(['id', 'rt', 'rw', 'dusun']);

        return Inertia::render('Admin/Users/Form', [
            'roles' => $roles,
            'wilayah' => $wilayah,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'nik' => 'nullable|string|size:16|unique:users,nik',
            'no_kk' => 'nullable|string|size:16',
            'phone' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|string|exists:roles,name',
            'wilayah_id' => 'nullable|exists:wilayah_rt_rw,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'nik' => $validated['nik'] ?? null,
            'no_kk' => $validated['no_kk'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'is_active' => true,
            'wilayah_id' => $validated['wilayah_id'] ?? null,
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dibuat.');
    }

    public function edit(User $user)
    {
        $user->load('roles');
        $user->role_name = $user->roles->first()?->name ?? 'warga';
        $roles = Role::all(['id', 'name']);
        $wilayah = WilayahRtRw::all(['id', 'rt', 'rw', 'dusun']);

        return Inertia::render('Admin/Users/Form', [
            'user' => $user,
            'roles' => $roles,
            'wilayah' => $wilayah,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'nik' => 'nullable|string|size:16|unique:users,nik,' . $user->id,
            'no_kk' => 'nullable|string|size:16',
            'phone' => 'nullable|string|max:20',
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role' => 'required|string|exists:roles,name',
            'is_active' => 'boolean',
            'wilayah_id' => 'nullable|exists:wilayah_rt_rw,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'nik' => $validated['nik'] ?? null,
            'no_kk' => $validated['no_kk'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'wilayah_id' => $validated['wilayah_id'] ?? null,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        // Sync role
        $user->syncRoles([$validated['role']]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()
                ->with('error', 'Tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dihapus.');
    }
}
