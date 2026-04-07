<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterType extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'template_id',
        'requires_rt_approval',
        'is_active',
    ];

    protected $casts = [
        'requires_rt_approval' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $appends = ['nama_surat', 'kode_surat'];

    public function getNamaSuratAttribute()
    {
        return $this->name;
    }

    public function getKodeSuratAttribute()
    {
        return $this->code;
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(LetterTemplate::class, 'template_id');
    }

    public function letterRequests(): HasMany
    {
        return $this->hasMany(LetterRequest::class);
    }
}
