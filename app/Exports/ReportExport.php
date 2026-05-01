<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ReportExport implements FromCollection, WithHeadings, WithMapping
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
                return ['No', 'NIK', 'Nama Lengkap', 'Hubungan Keluarga', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'RT/RW', 'Agama', 'Pekerjaan', 'Status'];
            case 'rukem':
                return ['No', 'No. Anggota', 'Kepala Keluarga', 'No. KK', 'RT/RW', 'Tanggal Gabung', 'Status'];
            case 'pindah':
            case 'masuk':
            case 'meninggal':
            case 'lahir':
                return ['No', 'NIK', 'Nama Lengkap', 'Tanggal Mutasi', 'Asal/Tujuan', 'Keterangan'];
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
                    $rtRw = 'RT ' . $row->familyCard->wilayah->rt . '/RW ' . $row->familyCard->wilayah->rw;
                }
                return [
                    $index,
                    $row->nik,
                    $row->nama_lengkap,
                    ucfirst($row->hubungan_keluarga ?? '-'),
                    $row->jenis_kelamin,
                    $row->tempat_lahir,
                    date('d/m/Y', strtotime($row->tanggal_lahir)),
                    $rtRw,
                    $row->agama,
                    $row->pekerjaan,
                    $row->status_penduduk,
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
            default:
                return [];
        }
    }
}
