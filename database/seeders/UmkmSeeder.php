<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Resident;
use App\Models\Umkm;

class UmkmSeeder extends Seeder
{
    public function run(): void
    {
        $umkmResidents = Resident::where('status_penduduk', 'aktif')
            ->whereHas('familyCard')
            ->inRandomOrder()
            ->take(12)
            ->get();

        $sektorUsaha = ['kuliner', 'jasa', 'perdagangan', 'pertanian', 'kerajinan', 'teknologi', 'lainnya'];
        $rentangOmzet = ['belum_ada', '<1jt', '1-5jt', '5-15jt', '15-50jt', '>50jt'];
        $jumlahKaryawan = ['0', '1-4', '5-19', '20+'];

        $namaUsahaPrefixes = ['Warung', 'Toko', 'Bengkel', 'Salon', 'Kerajinan', 'Layanan', 'Kebun', 'Konter', 'Catering', 'Jahit'];

        foreach ($umkmResidents as $i => $resident) {
            $prefix = $namaUsahaPrefixes[array_rand($namaUsahaPrefixes)];
            $sektor = $sektorUsaha[array_rand($sektorUsaha)];
            
            Umkm::create([
                'resident_id' => $resident->id,
                'nama_usaha' => $prefix . ' ' . explode(' ', $resident->nama_lengkap)[0],
                'sektor_usaha' => $sektor,
                'alamat_sama_domisili' => (bool)rand(0, 1),
                'alamat_usaha' => 'Jl. Desa Cileles No. ' . rand(1, 100),
                'memiliki_nib' => (bool)rand(0, 1),
                'nomor_nib' => rand(0, 1) ? 'NIB' . str_pad((string)rand(1, 999999), 10, '0', STR_PAD_LEFT) : null,
                'rentang_omzet' => $rentangOmzet[array_rand($rentangOmzet)],
                'jumlah_karyawan' => $jumlahKaryawan[array_rand($jumlahKaryawan)],
                'deskripsi' => 'Usaha ' . $sektor . ' yang didirikan oleh ' . $resident->nama_lengkap,
                'status' => 'aktif',
            ]);
        }
    }
}
