<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyCard extends Model
{
    protected $fillable = [
        'no_kk',
        'kepala_keluarga_id',
        'wilayah_id',
        'alamat',
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
}
