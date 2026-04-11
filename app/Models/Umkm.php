<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Umkm extends Model
{
    protected $table = 'umkm';

    protected $fillable = [
        'resident_id',
        'nama_usaha',
        'sektor_usaha',
        'alamat_sama_domisili',
        'alamat_usaha',
        'foto_tempat_usaha',
        'memiliki_nib',
        'nomor_nib',
        'rentang_omzet',
        'jumlah_karyawan',
        'deskripsi',
        'status',
    ];

    protected $casts = [
        'alamat_sama_domisili' => 'boolean',
        'memiliki_nib' => 'boolean',
    ];

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    /**
     * Get the effective business address.
     */
    public function getAlamatEfektifAttribute(): string
    {
        if ($this->alamat_sama_domisili) {
            return $this->resident?->alamat_lengkap ?? '-';
        }
        return $this->alamat_usaha ?? '-';
    }
}
