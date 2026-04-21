<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Resident;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredWargaController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/RegisterWarga', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nik' => 'required|string|size:16',
            'nama_lengkap' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 1. Verify if resident exists in database
        $resident = Resident::where('nik', $request->nik)
            ->where('tanggal_lahir', $request->tanggal_lahir)
            ->first();

        if (!$resident) {
            return back()->withErrors([
                'nik' => 'Data kependudukan tidak ditemukan. Pastikan NIK dan Tanggal Lahir sesuai dengan KTP Anda, atau hubungi Ketua RT/RW anda.',
            ])->withInput();
        }

        // 2. Check if this resident already has a user account
        if ($resident->user) {
            return back()->withErrors([
                'nik' => 'Akun dengan NIK ini sudah terdaftar. Silakan login atau gunakan fitur lupa password.',
            ])->withInput();
        }

        // 3. Create the user
        $user = User::create([
            'name' => $request->nama_lengkap, // Use provided name or resident name? Usually resident name is more authoritative
            'email' => $request->email,
            'nik' => $request->nik,
            'password' => Hash::make($request->password),
            'resident_id' => $resident->id,
            'is_active' => true, // Automatic activation for verified residents
            'wilayah_id' => $resident->familyCard ? $resident->familyCard->wilayah_id : null,
        ]);

        $user->assignRole('warga');

        event(new Registered($user));

        // Redirect with success message
        return redirect(route('login'))->with('status', 'Pendaftaran akun warga berhasil! Silakan login menggunakan NIK atau email Anda.');
    }
}
