<?php

namespace App\Exports;

use App\Models\Resident;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ResidentsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Resident::with('familyCard')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'NIK',
            'No. KK',
            'Nama Lengkap',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Jenis Kelamin',
            'Agama',
            'Pendidikan',
            'Status Kawin',
            'Pekerjaan',
            'Golongan Darah',
            'Alamat Tetap (KK)',
            'Alamat Domisili',
            'Status Penduduk',
            'Didaftarkan Pada'
        ];
    }

    public function map($resident): array
    {
        return [
            $resident->id,
            "'" . $resident->nik, // Force as string in Excel
            $resident->familyCard ? "'" . $resident->familyCard->no_kk : '-',
            $resident->nama_lengkap,
            $resident->tempat_lahir,
            $resident->tanggal_lahir,
            $resident->jenis_kelamin,
            $resident->agama,
            $resident->pendidikan,
            $resident->status_kawin,
            $resident->pekerjaan,
            $resident->golongan_darah,
            $resident->familyCard->alamat ?? '-',
            $resident->familyCard->alamat_domisili ?? '-',
            $resident->status_penduduk,
            $resident->created_at->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
