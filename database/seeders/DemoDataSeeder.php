<?php

namespace Database\Seeders;

use App\Models\FamilyCard;
use App\Models\Resident;
use App\Models\RukemMember;
use App\Models\User;
use App\Models\WilayahRtRw;
use App\Models\LetterRequest;
use App\Models\LetterType;
use App\Models\PopulationMutation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $wilayahList = WilayahRtRw::all();
        $letterTypes = LetterType::all();

        // Create Admin Users
        $kades = User::create([
            'name' => 'H. Ahmad Subroto, S.Pd',
            'email' => 'kades@sid.test',
            'nik' => '3301012001010001',
            'phone' => '081234567890',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $kades->assignRole('kades');

        $operator = User::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'operator@sid.test',
            'nik' => '3301012001010002',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $operator->assignRole('operator');

        // Create RW User (manages first RW grouping)
        $rwUser = User::create([
            'name' => 'H. Suroto, SE',
            'email' => 'rw@sid.test',
            'nik' => '3301012001010050',
            'phone' => '081234567850',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $rwUser->assignRole('rw');

        // Create Sie Rukem User
        $sieRukemUser = User::create([
            'name' => 'Endang Rahayu',
            'email' => 'sierukem@sid.test',
            'nik' => '3301012001010060',
            'phone' => '081234567860',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $sieRukemUser->assignRole('sie_rukem');

        // Create RT Users — one per wilayah
        $rtUsers = [];
        $rtNames = [
            'Bambang Hermanto', 'Dedi Supriadi', 'Rudi Hartono',
            'Eko Prasetyo', 'Agus Setiawan', 'Budi Santoso',
            'Hendra Gunawan', 'Joko Widodo',
        ];

        $rwLinked = false;
        foreach ($wilayahList as $i => $wilayah) {
            $rtUser = User::create([
                'name' => $rtNames[$i] ?? 'Ketua RT ' . $wilayah->rt,
                'email' => "rt{$wilayah->rt}rw{$wilayah->rw}@sid.test",
                'nik' => '330101200101' . str_pad($i + 10, 4, '0', STR_PAD_LEFT),
                'phone' => '0812345678' . str_pad($i + 10, 2, '0', STR_PAD_LEFT),
                'password' => Hash::make('password'),
                'is_active' => true,
            ]);
            $rtUser->assignRole('rt');
            $wilayah->update([
                'ketua_user_id' => $rtUser->id,
                'nama_ketua' => $rtUser->name,
            ]);
            $rtUsers[] = $rtUser;
        }

        // Create a dedicated wilayah entry for the RW user so they can be linked
        // We'll set the first wilayah's rw value for scoping
        if ($wilayahList->isNotEmpty()) {
            $firstWilayah = $wilayahList->first();
            // Create a "virtual" RW-level wilayah entry for RW user linkage
            $rwWilayah = WilayahRtRw::create([
                'rt' => '000',
                'rw' => $firstWilayah->rw,
                'dusun' => $firstWilayah->dusun,
                'ketua_user_id' => $rwUser->id,
                'nama_ketua' => $rwUser->name,
            ]);
        }

        // Create sample families with residents
        $families = [
            [
                'no_kk' => '3301010101200001',
                'wilayah_index' => 0,
                'alamat' => 'Jl. Sukamaju No. 1 RT 001/RW 001',
                'members' => [
                    [
                        'nik' => '3301015001850001',
                        'nama_lengkap' => 'Ahmad Fauzi',
                        'tempat_lahir' => 'Cilacap',
                        'tanggal_lahir' => '1985-05-15',
                        'jenis_kelamin' => 'L',
                        'agama' => 'Islam',
                        'golongan_darah' => 'A',
                        'status_perkawinan' => 'kawin',
                        'pekerjaan' => 'Petani',
                        'pendidikan' => 'SMA',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'kepala',
                        'status_penduduk' => 'aktif',
                        'create_user' => true,
                        'role' => 'kepala_kk',
                    ],
                    [
                        'nik' => '3301014501870002',
                        'nama_lengkap' => 'Siti Aminah',
                        'tempat_lahir' => 'Cilacap',
                        'tanggal_lahir' => '1987-08-20',
                        'jenis_kelamin' => 'P',
                        'agama' => 'Islam',
                        'golongan_darah' => 'B',
                        'status_perkawinan' => 'kawin',
                        'pekerjaan' => 'Ibu Rumah Tangga',
                        'pendidikan' => 'SMP',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'istri',
                        'status_penduduk' => 'aktif',
                    ],
                    [
                        'nik' => '3301015001100003',
                        'nama_lengkap' => 'Muhammad Rizki',
                        'tempat_lahir' => 'Cilacap',
                        'tanggal_lahir' => '2010-03-12',
                        'jenis_kelamin' => 'L',
                        'agama' => 'Islam',
                        'golongan_darah' => 'A',
                        'status_perkawinan' => 'belum_kawin',
                        'pekerjaan' => 'Pelajar/Mahasiswa',
                        'pendidikan' => 'SMP',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'anak',
                        'status_penduduk' => 'aktif',
                    ],
                ],
            ],
            [
                'no_kk' => '3301010101200002',
                'wilayah_index' => 1,
                'alamat' => 'Jl. Sukamaju No. 15 RT 002/RW 001',
                'members' => [
                    [
                        'nik' => '3301015001800004',
                        'nama_lengkap' => 'Suryadi Pratama',
                        'tempat_lahir' => 'Banyumas',
                        'tanggal_lahir' => '1980-11-03',
                        'jenis_kelamin' => 'L',
                        'agama' => 'Islam',
                        'golongan_darah' => 'O',
                        'status_perkawinan' => 'kawin',
                        'pekerjaan' => 'Wiraswasta',
                        'pendidikan' => 'S1',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'kepala',
                        'status_penduduk' => 'aktif',
                        'create_user' => true,
                        'role' => 'kepala_kk',
                    ],
                    [
                        'nik' => '3301014501830005',
                        'nama_lengkap' => 'Dewi Lestari',
                        'tempat_lahir' => 'Purwokerto',
                        'tanggal_lahir' => '1983-07-25',
                        'jenis_kelamin' => 'P',
                        'agama' => 'Islam',
                        'golongan_darah' => 'AB',
                        'status_perkawinan' => 'kawin',
                        'pekerjaan' => 'Guru',
                        'pendidikan' => 'S1',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'istri',
                        'status_penduduk' => 'aktif',
                    ],
                ],
            ],
            [
                'no_kk' => '3301010101200003',
                'wilayah_index' => 3,
                'alamat' => 'Jl. Mekar Sari No. 5 RT 001/RW 002',
                'members' => [
                    [
                        'nik' => '3301015001750006',
                        'nama_lengkap' => 'Hadi Wibowo',
                        'tempat_lahir' => 'Semarang',
                        'tanggal_lahir' => '1975-02-14',
                        'jenis_kelamin' => 'L',
                        'agama' => 'Kristen',
                        'golongan_darah' => 'B',
                        'status_perkawinan' => 'kawin',
                        'pekerjaan' => 'PNS',
                        'pendidikan' => 'S1',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'kepala',
                        'status_penduduk' => 'aktif',
                        'create_user' => true,
                        'role' => 'kepala_kk',
                    ],
                    [
                        'nik' => '3301014501780007',
                        'nama_lengkap' => 'Maria Kristina',
                        'tempat_lahir' => 'Semarang',
                        'tanggal_lahir' => '1978-09-30',
                        'jenis_kelamin' => 'P',
                        'agama' => 'Kristen',
                        'golongan_darah' => 'A',
                        'status_perkawinan' => 'kawin',
                        'pekerjaan' => 'Ibu Rumah Tangga',
                        'pendidikan' => 'SMA',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'istri',
                        'status_penduduk' => 'aktif',
                    ],
                    [
                        'nik' => '3301015001050008',
                        'nama_lengkap' => 'Daniel Wibowo',
                        'tempat_lahir' => 'Cilacap',
                        'tanggal_lahir' => '2005-12-01',
                        'jenis_kelamin' => 'L',
                        'agama' => 'Kristen',
                        'golongan_darah' => 'A',
                        'status_perkawinan' => 'belum_kawin',
                        'pekerjaan' => 'Pelajar/Mahasiswa',
                        'pendidikan' => 'SMA',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'anak',
                        'status_penduduk' => 'aktif',
                    ],
                    [
                        'nik' => '3301014501100009',
                        'nama_lengkap' => 'Sarah Wibowo',
                        'tempat_lahir' => 'Cilacap',
                        'tanggal_lahir' => '2010-06-15',
                        'jenis_kelamin' => 'P',
                        'agama' => 'Kristen',
                        'golongan_darah' => 'B',
                        'status_perkawinan' => 'belum_kawin',
                        'pekerjaan' => 'Pelajar/Mahasiswa',
                        'pendidikan' => 'SMP',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'anak',
                        'status_penduduk' => 'aktif',
                    ],
                ],
            ],
            [
                'no_kk' => '3301010101200004',
                'wilayah_index' => 6,
                'alamat' => 'Jl. Cempaka No. 3 RT 001/RW 003',
                'members' => [
                    [
                        'nik' => '3301015001900010',
                        'nama_lengkap' => 'Yoga Aditya',
                        'tempat_lahir' => 'Yogyakarta',
                        'tanggal_lahir' => '1990-04-22',
                        'jenis_kelamin' => 'L',
                        'agama' => 'Islam',
                        'golongan_darah' => 'O',
                        'status_perkawinan' => 'kawin',
                        'pekerjaan' => 'Pedagang',
                        'pendidikan' => 'SMA',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'kepala',
                        'status_penduduk' => 'aktif',
                        'create_user' => true,
                        'role' => 'kepala_kk',
                    ],
                    [
                        'nik' => '3301014501930011',
                        'nama_lengkap' => 'Indah Permatasari',
                        'tempat_lahir' => 'Cilacap',
                        'tanggal_lahir' => '1993-01-10',
                        'jenis_kelamin' => 'P',
                        'agama' => 'Islam',
                        'golongan_darah' => 'A',
                        'status_perkawinan' => 'kawin',
                        'pekerjaan' => 'Wiraswasta',
                        'pendidikan' => 'D3',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'istri',
                        'status_penduduk' => 'aktif',
                        'create_user' => true,
                        'role' => 'warga',
                    ],
                ],
            ],
            [
                'no_kk' => '3301010101200005',
                'wilayah_index' => 2,
                'alamat' => 'Jl. Sukamaju No. 22 RT 003/RW 001',
                'members' => [
                    [
                        'nik' => '3301015001650012',
                        'nama_lengkap' => 'Suparno',
                        'tempat_lahir' => 'Cilacap',
                        'tanggal_lahir' => '1965-08-17',
                        'jenis_kelamin' => 'L',
                        'agama' => 'Islam',
                        'golongan_darah' => 'tidak_tahu',
                        'status_perkawinan' => 'cerai_mati',
                        'pekerjaan' => 'Petani',
                        'pendidikan' => 'SD',
                        'kewarganegaraan' => 'WNI',
                        'hubungan_keluarga' => 'kepala',
                        'status_penduduk' => 'aktif',
                        'create_user' => true,
                        'role' => 'kepala_kk',
                    ],
                ],
            ],
        ];

        foreach ($families as $familyData) {
            $wilayah = $wilayahList[$familyData['wilayah_index']];

            // Create family card (without kepala_keluarga_id first)
            $familyCard = FamilyCard::create([
                'no_kk' => $familyData['no_kk'],
                'wilayah_id' => $wilayah->id,
                'alamat' => $familyData['alamat'],
                'status' => 'aktif',
            ]);

            $kepalaId = null;

            foreach ($familyData['members'] as $memberData) {
                $createUser = $memberData['create_user'] ?? false;
                $role = $memberData['role'] ?? null;
                unset($memberData['create_user'], $memberData['role']);

                $resident = Resident::create(array_merge($memberData, [
                    'family_card_id' => $familyCard->id,
                ]));

                if ($memberData['hubungan_keluarga'] === 'kepala') {
                    $kepalaId = $resident->id;
                }

                if ($createUser) {
                    $user = User::create([
                        'name' => $memberData['nama_lengkap'],
                        'nik' => $memberData['nik'],
                        'no_kk' => $familyData['no_kk'],
                        'phone' => '08' . rand(100000000, 999999999),
                        'password' => Hash::make('password'),
                        'resident_id' => $resident->id,
                        'is_active' => true,
                    ]);
                    if ($role) {
                        $user->assignRole($role);
                    }
                }
            }

            if ($kepalaId) {
                $familyCard->update(['kepala_keluarga_id' => $kepalaId]);
            }
        }

        // Create sample letter requests
        $wargaUsers = User::role(['kepala_kk', 'warga'])->get();
        $statuses = ['diajukan', 'disetujui_rt', 'diproses_desa', 'selesai', 'ditolak_rt'];
        $keperluanList = [
            'Pembuatan KTP baru',
            'Pengurusan surat pindah',
            'Keperluan administrasi pernikahan',
            'Pengajuan bantuan sosial',
            'Pembuatan rekening bank',
            'Pendaftaran sekolah anak',
            'Melamar pekerjaan',
            'Pengurusan SIM',
        ];

        foreach ($wargaUsers->take(4) as $i => $user) {
            if (!$user->resident) continue;

            $resident = $user->resident;
            $familyCard = $resident->familyCard;
            if (!$familyCard) continue;

            $letterType = $letterTypes->random();
            $status = $statuses[$i % count($statuses)];

            $lr = LetterRequest::create([
                'letter_type_id' => $letterType->id,
                'pemohon_user_id' => $user->id,
                'subject_resident_id' => $resident->id,
                'wilayah_id' => $familyCard->wilayah_id,
                'keperluan' => $keperluanList[$i % count($keperluanList)],
                'status' => $status,
            ]);

            // Add approval data for approved requests
            if (in_array($status, ['disetujui_rt', 'diproses_desa', 'selesai'])) {
                $rtUser = User::role('rt')
                    ->whereHas('managedWilayah', fn($q) => $q->where('id', $familyCard->wilayah_id))
                    ->first();

                if ($rtUser) {
                    $lr->update([
                        'approved_by' => $rtUser->id,
                        'approved_at' => now()->subDays(rand(1, 5)),
                    ]);
                }
            }

            if (in_array($status, ['diproses_desa', 'selesai'])) {
                $lr->update([
                    'processed_by' => $operator->id,
                    'processed_at' => now()->subDays(rand(0, 2)),
                ]);
            }

            if ($status === 'selesai') {
                $lr->update([
                    'completed_at' => now()->subDay(),
                    'nomor_surat' => sprintf('%03d/DS-3301012001/%s/%s', $i + 1, date('m'), date('Y')),
                ]);
            }
        }

        // Create sample population mutations
        PopulationMutation::create([
            'resident_id' => Resident::first()->id,
            'type' => 'datang',
            'tanggal_mutasi' => now()->subMonths(6),
            'keterangan' => 'Pindah dari Kabupaten Banyumas',
            'asal_tujuan' => 'Kabupaten Banyumas',
            'processed_by' => $operator->id,
        ]);

        // Create sample Rukun Kematian members
        $activeResidents = Resident::where('status_penduduk', 'aktif')->take(5)->get();
        foreach ($activeResidents as $i => $resident) {
            RukemMember::create([
                'resident_id' => $resident->id,
                'nomor_anggota' => 'RKM-' . str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                'tanggal_gabung' => now()->subMonths(rand(1, 24)),
                'status_keanggotaan' => $i < 4 ? 'aktif' : 'nonaktif',
                'keterangan' => $i === 0 ? 'Anggota pendiri' : null,
            ]);
        }
    }
}
