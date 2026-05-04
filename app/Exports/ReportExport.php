<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReportExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $data;
    protected $type;

    public function __construct($data, $type)
    {
        $this->data = $data;
        $this->type = $type;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        switch ($this->type) {
            case 'penduduk':
                return [
                    'ID',
                    'NIK',
                    'No. KK',
                    'RT/RW',
                    'Nama Lengkap',
                    'Hubungan Keluarga',
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
            case 'rukem':
                return ['No', 'No. Anggota', 'Kepala Keluarga', 'No. KK', 'RT/RW', 'Tanggal Gabung', 'Status'];
            case 'pindah':
            case 'masuk':
            case 'meninggal':
            case 'lahir':
                return ['No', 'NIK', 'Nama Lengkap', 'Tanggal Mutasi', 'Asal/Tujuan', 'Keterangan'];
            case 'umkm':
                return [
                    'No',
                    'Nama Usaha',
                    'Sektor Usaha',
                    'Pemilik',
                    'RT/RW',
                    'Alamat Usaha',
                    'Memiliki NIB',
                    'Nomor NIB',
                    'Omzet',
                    'Jumlah Karyawan',
                    'Status'
                ];
            default:
                return [];
        }
    }

    public function map($row): array
    {
        static $index = 0;
        $index++;

        switch ($this->type) {
            case 'penduduk':
                $rtRw = '-';
                if ($row->familyCard && $row->familyCard->wilayah) {
                    $rtRw = 'RT ' . str_pad($row->familyCard->wilayah->rt, 2, '0', STR_PAD_LEFT) . '/RW ' . str_pad($row->familyCard->wilayah->rw, 2, '0', STR_PAD_LEFT);
                }
                return [
                    $row->id,
                    "'" . $row->nik, // Force as string in Excel
                    $row->familyCard ? "'" . $row->familyCard->no_kk : '-',
                    $rtRw,
                    $row->nama_lengkap,
                    ucfirst($row->hubungan_keluarga ?? '-'),
                    $row->tempat_lahir,
                    $row->tanggal_lahir,
                    $row->jenis_kelamin,
                    $row->agama,
                    $row->pendidikan,
                    $row->status_perkawinan ?? $row->status_kawin,
                    $row->pekerjaan,
                    $row->golongan_darah,
                    $row->familyCard->alamat ?? '-',
                    $row->familyCard->alamat_domisili ?? '-',
                    $row->status_penduduk,
                    $row->created_at ? $row->created_at->format('Y-m-d H:i:s') : '-',
                ];
            case 'rukem':
                $kk = '-';
                $noKk = '-';
                $rtRw = '-';
                if ($row->familyCard) {
                    $noKk = $row->familyCard->no_kk;
                    if ($row->familyCard->kepalaKeluarga) {
                        $kk = $row->familyCard->kepalaKeluarga->nama_lengkap;
                    }
                    if ($row->familyCard->wilayah) {
                        $rtRw = 'RT ' . $row->familyCard->wilayah->rt . '/RW ' . $row->familyCard->wilayah->rw;
                    }
                }
                return [
                    $index,
                    $row->nomor_anggota,
                    $kk,
                    $noKk,
                    $rtRw,
                    date('d/m/Y', strtotime($row->tanggal_gabung)),
                    $row->status_keanggotaan,
                ];
            case 'pindah':
            case 'masuk':
            case 'meninggal':
            case 'lahir':
                $nik = '-';
                $nama = '-';
                if ($row->resident) {
                    $nik = $row->resident->nik;
                    $nama = $row->resident->nama_lengkap;
                }
                return [
                    $index,
                    $nik,
                    $nama,
                    date('d/m/Y', strtotime($row->tanggal_mutasi)),
                    $row->asal_tujuan,
                    $row->keterangan,
                ];
            case 'umkm':
                $pemilik = '-';
                $rtRw = '-';
                if ($row->resident) {
                    $pemilik = $row->resident->nama_lengkap;
                    if ($row->resident->familyCard && $row->resident->familyCard->wilayah) {
                        $rtRw = 'RT ' . $row->resident->familyCard->wilayah->rt . '/RW ' . $row->resident->familyCard->wilayah->rw;
                    }
                }
                return [
                    $index,
                    $row->nama_usaha,
                    $row->sektor_usaha,
                    $pemilik,
                    $rtRw,
                    $row->alamat_usaha,
                    $row->memiliki_nib ? 'Ya' : 'Tidak',
                    $row->nomor_nib ?? '-',
                    $row->rentang_omzet,
                    $row->jumlah_karyawan,
                    $row->status,
                ];
            default:
                return [];
        }
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
