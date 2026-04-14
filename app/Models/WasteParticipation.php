<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WasteParticipation extends Model
{
    protected $fillable = [
        'family_card_id',
        'is_active',
        'balance',
        'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'balance' => 'decimal:2',
    ];

    public function familyCard(): BelongsTo
    {
        return $this->belongsTo(FamilyCard::class);
    }
}
