<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class FamilyCard extends Model
{
    protected $fillable = [
        'no_kk',
        'kepala_keluarga_id',
        'wilayah_id',
        'alamat',
        'kode_pos',
        'status_kepemilikan_bangunan',
        'jenis_lantai',
        'jenis_dinding',
        'fasilitas_sanitasi',
        'sumber_air_minum',
        'alamat_domisili',
        'status',
    ];

    public function kepalaKeluarga(): BelongsTo
    {
        return $this->belongsTo(Resident::class, 'kepala_keluarga_id');
    }

    public function wilayah(): BelongsTo
    {
        return $this->belongsTo(WilayahRtRw::class, 'wilayah_id');
    }

    public function anggotaKeluarga(): HasMany
    {
        return $this->hasMany(Resident::class, 'family_card_id');
    }

    public function getMemberCountAttribute(): int
    {
        return $this->anggotaKeluarga()->count();
    }

    public function rukemMember(): HasOne
    {
        return $this->hasOne(RukemMember::class, 'family_card_id');
    }
}
