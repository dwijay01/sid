<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InternetSubscription extends Model
{
    protected $fillable = [
        'family_card_id',
        'package_name',
        'installation_date',
        'access_point_location',
        'status',
        'notes',
    ];

    protected $casts = [
        'installation_date' => 'date',
    ];

    public function familyCard(): BelongsTo
    {
        return $this->belongsTo(FamilyCard::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(InternetPayment::class);
    }
}
