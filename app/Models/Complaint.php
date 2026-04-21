<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Complaint extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'resident_id',
        'wilayah_id',
        'title',
        'category',
        'description',
        'attachment_path',
        'status',
        'rt_response',
        'rw_response',
        'is_secret'
    ];

    protected $casts = [
        'is_secret' => 'boolean',
    ];

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function wilayah(): BelongsTo
    {
        return $this->belongsTo(WilayahRtRw::class, 'wilayah_id');
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'menunggu' => 'Menunggu Tanggapan',
            'diproses_rt' => 'Diproses RT',
            'diteruskan_rw' => 'Diteruskan ke RW',
            'selesai' => 'Selesai',
            'ditolak' => 'Ditolak',
            default => 'Tidak Diketahui',
        };
    }
}
