<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WilayahRtRw extends Model
{
    protected $table = 'wilayah_rt_rw';

    protected $fillable = [
        'rt',
        'rw',
        'dusun',
        'nama_ketua',
        'ketua_user_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function ketua(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ketua_user_id');
    }

    public function familyCards(): HasMany
    {
        return $this->hasMany(FamilyCard::class, 'wilayah_id');
    }

    public function letterRequests(): HasMany
    {
        return $this->hasMany(LetterRequest::class, 'wilayah_id');
    }

    public function getFullNameAttribute(): string
    {
        return "RT {$this->rt} / RW {$this->rw}" . ($this->dusun ? " - {$this->dusun}" : '');
    }
}
