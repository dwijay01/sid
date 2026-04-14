<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternetPayment extends Model
{
    protected $fillable = [
        'internet_subscription_id',
        'month',
        'year',
        'amount',
        'status',
        'payment_date',
        'notes',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(InternetSubscription::class, 'internet_subscription_id');
    }
}
