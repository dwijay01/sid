<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterTemplate extends Model
{
    protected $fillable = [
        'name',
        'body_template',
        'kop_surat_path',
        'footer_text',
        'created_by',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function letterTypes(): HasMany
    {
        return $this->hasMany(LetterType::class, 'template_id');
    }
}
