<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RukemMember extends Model
{
    protected $fillable = [
        'resident_id',
        'nomor_anggota',
        'tanggal_gabung',
        'status_keanggotaan',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_gabung' => 'date',
    ];

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    /**
     * Generate a unique member number.
     */
    public static function generateNomorAnggota(): string
    {
        $lastMember = static::orderByDesc('id')->first();
        $nextNumber = $lastMember ? ((int) substr($lastMember->nomor_anggota, 4)) + 1 : 1;
        return 'RKM-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }
}
