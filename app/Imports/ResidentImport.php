<?php

namespace App\Imports;

use App\Models\Resident;
use App\Models\FamilyCard;
use App\Models\WilayahRtRw;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Carbon\Carbon;

class ResidentImport implements ToCollection, WithStartRow
{
    private $wilayahId;
    private $skipped = [];
    private $successCount = 0;
    private $duplicateAction; // 'skip' or 'update'
    private $currentHeadNik = null;

    public function __construct($wilayahId = null, $sheetName = null, $duplicateAction = 'skip')
    {
        $this->wilayahId = $wilayahId;
        $this->duplicateAction = $duplicateAction;
    }

    public function startRow(): int
    {
        return 2; // Data starts at Row 2
    }

    public function collection(Collection $rows)
    {
        $currentFamilyCard = null;

        foreach ($rows as $index => $row) {
            // NIK is at $row[1]
            $nik = trim((string)($row[1] ?? ''));
            // Remove leading single quote if present
            if (str_starts_with($nik, "'")) $nik = substr($nik, 1);

            if (empty($nik)) {
                $this->skipped[] = [
                    'nama' => trim((string)($row[4] ?? 'Baris ' . ($index + 2))),
                    'nik' => '-',
                    'reason' => 'NIK tidak ditemukan atau kosong.'
                ];
                continue;
            }

            $noKkFromExcel = trim((string)($row[2] ?? ''));
            if (str_starts_with($noKkFromExcel, "'")) $noKkFromExcel = substr($noKkFromExcel, 1);

            $rtRwRaw = trim((string)($row[3] ?? ''));
            $nama = trim((string)($row[4] ?? ''));
            $hubungan = trim((string)($row[5] ?? ''));
            
            // Determine Wilayah
            $rowWilayahId = $this->wilayahId;
            if (!$rowWilayahId && $rtRwRaw) {
                if (preg_match('/RT\s*(\d+)\s*\/\s*RW\s*(\d+)/i', $rtRwRaw, $matches)) {
                    $rtNumber = (int)$matches[1];
                    $rwNumber = (int)$matches[2];
                    $wilayah = WilayahRtRw::firstOrCreate(
                        ['rt' => $rtNumber, 'rw' => $rwNumber],
                        ['is_active' => true]
                    );
                    $rowWilayahId = $wilayah->id;
                }
            } else if ($this->wilayahId && $rtRwRaw) {
                // If RT role (wilayahId provided), check if matches
                $wilayah = WilayahRtRw::find($this->wilayahId);
                if ($wilayah) {
                    if (preg_match('/RT\s*(\d+)\s*\/\s*RW\s*(\d+)/i', $rtRwRaw, $matches)) {
                        $rtNumber = (int)$matches[1];
                        if ($wilayah->rt != $rtNumber) {
                            $this->skipped[] = [
                                'nama' => $nama,
                                'nik' => $nik,
                                'reason' => 'Beda RT (Bukan anggota RT ' . $wilayah->rt . ').'
                            ];
                            continue;
                        }
                    }
                }
            }

            if (!$rowWilayahId) {
                $this->skipped[] = [
                    'nama' => $nama,
                    'nik' => $nik,
                    'reason' => 'Wilayah RT/RW tidak diketahui.'
                ];
                continue;
            }

            $mappedHubungan = $this->mapHubungan($hubungan);
            if ($mappedHubungan === 'kepala') {
                $this->currentHeadNik = $nik;
                $finalNoKk = $noKkFromExcel ?: $nik;
                
                $currentFamilyCard = FamilyCard::updateOrCreate(
                    ['no_kk' => $finalNoKk],
                    [
                        'wilayah_id' => $rowWilayahId,
                        'alamat' => $row[14] ?? '-',
                        'alamat_domisili' => $row[15] ?? null,
                        'status' => 'aktif'
                    ]
                );
            } else {
                $finalNoKk = $noKkFromExcel ?: $this->currentHeadNik;
                
                if ($finalNoKk) {
                    $currentFamilyCard = FamilyCard::firstOrCreate(
                        ['no_kk' => $finalNoKk],
                        [
                            'wilayah_id' => $rowWilayahId,
                            'alamat' => $row[14] ?? '-',
                            'alamat_domisili' => $row[15] ?? null,
                            'status' => 'aktif'
                        ]
                    );
                }
            }

            $dateStr = trim((string)($row[7] ?? ''));
            $date = null;
            if ($dateStr) {
                try {
                    $date = Carbon::parse($dateStr);
                } catch (\Exception $e) {
                    $date = null;
                }
            }
            $needsUpdate = ($date === null);
            
            $data = [
                'family_card_id' => $currentFamilyCard ? $currentFamilyCard->id : null,
                'nik' => $nik,
                'nama_lengkap' => $nama,
                'hubungan_keluarga' => $mappedHubungan,
                'jenis_kelamin' => $this->mapGender($row[8] ?? ''),
                'tempat_lahir' => $row[6] ?? '-',
                'tanggal_lahir' => $date,
                'agama' => $this->mapAgama($row[9] ?? ''),
                'pendidikan' => $this->mapPendidikan($row[10] ?? ''),
                'status_perkawinan' => $this->mapStatusPerkawinan($row[11] ?? ''),
                'pekerjaan' => $row[12] ?? '-',
                'golongan_darah' => $this->mapGolonganDarah($row[13] ?? ''),
                'alamat_sekarang' => $currentFamilyCard ? $currentFamilyCard->alamat : '-',
                'status_penduduk' => $this->mapStatusPenduduk($row[16] ?? 'aktif'),
                'needs_update' => $needsUpdate,
            ];

            $existing = Resident::where('nik', $nik)->first();
            if ($existing) {
                if ($this->duplicateAction === 'update') {
                    $existing->update($data);
                    $resident = $existing;
                } else {
                    $this->skipped[] = [
                        'nama' => $nama,
                        'nik' => $nik,
                        'reason' => 'NIK sudah terdaftar di sistem.'
                    ];
                    continue;
                }
            } else {
                $resident = Resident::create($data);
            }

            if ($mappedHubungan === 'kepala' && $currentFamilyCard) {
                $currentFamilyCard->update(['kepala_keluarga_id' => $resident->id ?? null]);
            }

            $this->successCount++;
        }
    }

    private function mapGender($input)
    {
        $input = strtoupper(trim((string)$input));
        return ($input === 'P' || $input === 'PEREMPUAN') ? 'P' : 'L';
    }

    private function mapHubungan($input)
    {
        $input = strtolower(trim((string)$input));
        if (str_contains($input, 'kepala') || $input === 'kk') return 'kepala';
        if (str_contains($input, 'istri')) return 'istri';
        if (str_contains($input, 'anak')) return 'anak';
        if (str_contains($input, 'menantu')) return 'menantu';
        if (str_contains($input, 'cucu')) return 'cucu';
        if (str_contains($input, 'orang tua') || str_contains($input, 'orang_tua')) return 'orang_tua';
        if (str_contains($input, 'mertua')) return 'mertua';
        if (str_contains($input, 'famili')) return 'famili_lain';
        return 'lainnya';
    }

    private function mapAgama($input)
    {
        $input = strtolower(trim((string)$input));
        if (str_contains($input, 'islam')) return 'Islam';
        if (str_contains($input, 'kristen')) return 'Kristen';
        if (str_contains($input, 'katolik')) return 'Katolik';
        if (str_contains($input, 'hindu')) return 'Hindu';
        if (str_contains($input, 'budha') || str_contains($input, 'buddha')) return 'Buddha';
        if (str_contains($input, 'konghucu')) return 'Konghucu';
        return 'Islam'; // Default
    }

    private function mapPendidikan($input)
    {
        $input = strtoupper(trim((string)$input));
        if (str_contains($input, 'SLTA') || str_contains($input, 'SMA')) return 'SMA';
        if (str_contains($input, 'SLTP') || str_contains($input, 'SMP')) return 'SMP';
        if (str_contains($input, 'SD')) return 'SD';
        if (str_contains($input, 'SARJANA') || str_contains($input, 'S1')) return 'S1';
        if (str_contains($input, 'D1')) return 'D1';
        if (str_contains($input, 'D2')) return 'D2';
        if (str_contains($input, 'D3')) return 'D3';
        if (str_contains($input, 'S2')) return 'S2';
        if (str_contains($input, 'S3')) return 'S3';
        return 'tidak_sekolah';
    }

    private function mapStatusPerkawinan($input)
    {
        $input = strtolower(trim((string)$input));
        if (str_contains($input, 'belum')) return 'belum_kawin';
        if (str_contains($input, 'hidup')) return 'cerai_hidup';
        if (str_contains($input, 'mati')) return 'cerai_mati';
        if (str_contains($input, 'kawin') || str_contains($input, 'nikah')) return 'kawin';
        return 'belum_kawin';
    }

    private function mapGolonganDarah($input)
    {
        $input = strtoupper(trim((string)$input));
        if ($input === 'A' || $input === 'B' || $input === 'AB' || $input === 'O') return $input;
        return 'tidak_tahu';
    }

    private function mapStatusPenduduk($input)
    {
        $input = strtolower(trim((string)$input));
        if (str_contains($input, 'meninggal')) return 'meninggal';
        if (str_contains($input, 'pindah')) return 'pindah';
        if (str_contains($input, 'hilang')) return 'hilang';
        return 'aktif';
    }

    public function getSkipped()
    {
        return $this->skipped;
    }

    public function getSuccessCount()
    {
        return $this->successCount;
    }
}
