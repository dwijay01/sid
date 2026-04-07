<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrValidation extends Model
{
    protected $fillable = [
        'letter_request_id',
        'qr_code',
        'qr_image_path',
        'validated_by',
        'validated_at',
        'metadata',
    ];

    protected $casts = [
        'validated_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function letterRequest(): BelongsTo
    {
        return $this->belongsTo(LetterRequest::class);
    }

    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validated_by');
    }
}
