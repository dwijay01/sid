<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PopulationMutation extends Model
{
    protected $fillable = [
        'resident_id',
        'type',
        'tanggal_mutasi',
        'keterangan',
        'asal_tujuan',
        'no_surat_mutasi',
        'processed_by',
    ];

    protected $casts = [
        'tanggal_mutasi' => 'date',
    ];

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
