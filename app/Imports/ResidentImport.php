<?php

namespace App\Imports;

use App\Models\Resident;
use App\Models\FamilyCard;
use App\Models\WilayahRtRw;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Carbon\Carbon;

class ResidentImport implements ToCollection, WithStartRow, WithMultipleSheets
{
    private $wilayahId;
    private $sheetName;
    private $skipped = [];
    private $successCount = 0;
    private $duplicateAction; // 'skip' or 'update'

    public function __construct($wilayahId = null, $sheetName = null, $duplicateAction = 'skip')
    {
        $this->wilayahId = $wilayahId;
        $this->sheetName = $sheetName;
        $this->duplicateAction = $duplicateAction;
    }

    public function sheets(): array
    {
        if ($this->sheetName) {
            return [
                $this->sheetName => $this
            ];
        }
        return [0 => $this]; // Default first sheet
    }

    public function startRow(): int
    {
        return 7; // Data starts at Row 7
    }

    private $currentHeadNik = null;

    public function collection(Collection $rows)
    {
        $currentFamilyCard = null;

        foreach ($rows as $index => $row) {
            // Skip if NIK (Col 4) is empty
            if (empty($row[4])) {
                $this->skipped[] = [
                    'nama' => trim((string)($row[2] ?? 'Baris ' . ($index + 7))),
                    'nik' => '-',
                    'reason' => 'NIK tidak ditemukan atau kosong.'
                ];
                continue;
            }

            $nik = trim((string)$row[4]);
            $noKkFromExcel = trim((string)($row[5] ?? ''));
            $nama = trim((string)$row[2]);
            $hubungan = trim((string)$row[3]);

            // If it's Head of Family (KK), update tracked KK NIK
            if ($hubungan === 'KK' || $hubungan === 'Kepala Keluarga') {
                $this->currentHeadNik = $nik;
                $finalNoKk = $noKkFromExcel ?: $nik;
                
                $currentFamilyCard = FamilyCard::updateOrCreate(
                    ['no_kk' => $finalNoKk],
                    [
                        'wilayah_id' => $this->wilayahId,
                        'alamat' => $row[10] ?? '-', // shifted from 9
                        'status' => 'aktif'
                    ]
                );
            } else {
                // For members, if No KK is empty, use the current head's NIK
                $finalNoKk = $noKkFromExcel ?: $this->currentHeadNik;
                
                if ($finalNoKk) {
                    $currentFamilyCard = FamilyCard::firstOrCreate(
                        ['no_kk' => $finalNoKk],
                        [
                            'wilayah_id' => $this->wilayahId,
                            'alamat' => $row[10] ?? '-', // shifted from 9
                            'status' => 'aktif'
                        ]
                    );
                }
            }

            // Parse Birth Info - shifted from 7 to 8
            $birthInfo = $this->parseBirthInfo($row[8] ?? '');
            $needsUpdate = ($birthInfo['date'] === null);
            
            // Gender - shifted from 5/6 to 6/7
            $gender = 'L';
            if (!empty($row[7]) && strtoupper(trim((string)$row[7])) === 'P') {
                $gender = 'P';
            } elseif (empty($row[6]) && !empty($row[7])) {
                $gender = 'P';
            }

            $data = [
                'family_card_id' => $currentFamilyCard?->id,
                'nik' => $nik,
                'nama_lengkap' => $nama,
                'hubungan_keluarga' => $this->mapHubungan($hubungan),
                'jenis_kelamin' => $gender,
                'tempat_lahir' => $birthInfo['place'],
                'tanggal_lahir' => $birthInfo['date'],
                'alamat_sekarang' => $row[10] ?? '-', // shifted from 9
                'agama' => $this->mapAgama($row[11] ?? ''), // shifted from 10
                'pendidikan' => $this->mapPendidikan($row[12] ?? ''), // shifted from 11
                'pekerjaan' => $row[13] ?? '-', // shifted from 12
                'status_penduduk' => 'aktif',
                'needs_update' => $needsUpdate,
            ];

            // Check duplicate NIK
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

            // Update Family Card's head if not set
            if (($hubungan === 'KK' || $hubungan === 'Kepala Keluarga') && $currentFamilyCard) {
                $currentFamilyCard->update(['kepala_keluarga_id' => $resident->id ?? null]);
            }

            $this->successCount++;
        }
    }

    private function parseBirthInfo($info)
    {
        $parts = explode(',', $info);
        $place = trim($parts[0] ?? '-');
        $dateStr = trim($parts[1] ?? '');
        
        $date = null;
        if ($dateStr) {
            try {
                // Try d-m-Y first
                $date = Carbon::createFromFormat('d-m-Y', $dateStr);
            } catch (\Exception $e) {
                try {
                    // Try d/m/Y
                    $date = Carbon::createFromFormat('d/m/Y', $dateStr);
                } catch (\Exception $e) {
                    $date = null;
                }
            }
        }

        return ['place' => $place, 'date' => $date];
    }

    private function mapHubungan($input)
    {
        $map = [
            'KK' => 'kepala',
            'Istri' => 'istri',
            'Anak' => 'anak',
            'Cucu' => 'cucu',
            'Menantu' => 'menantu',
            'Orang Tua' => 'orang_tua',
            'Mertua' => 'mertua',
            'Famili Lain' => 'famili_lain',
            'Lainnya' => 'lainnya'
        ];
        return $map[$input] ?? 'lainnya';
    }

    private function mapAgama($input)
    {
        $input = strtolower(trim((string)$input));
        if (str_contains($input, 'islam')) return 'Islam';
        if (str_contains($input, 'kristen')) return 'Kristen';
        if (str_contains($input, 'katolik')) return 'Katolik';
        if (str_contains($input, 'hindu')) return 'Hindu';
        if (str_contains($input, 'budha')) return 'Buddha';
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

    public function getSkipped()
    {
        return $this->skipped;
    }

    public function getSuccessCount()
    {
        return $this->successCount;
    }
}
