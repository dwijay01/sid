<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterRequest extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nomor_surat',
        'letter_type_id',
        'pemohon_user_id',
        'subject_resident_id',
        'wilayah_id',
        'keperluan',
        'data_tambahan',
        'status',
        'catatan_penolakan',
        'approved_by',
        'approved_at',
        'processed_by',
        'processed_at',
        'completed_at',
        'is_bypass',
    ];

    protected $casts = [
        'data_tambahan' => 'array',
        'approved_at' => 'datetime',
        'processed_at' => 'datetime',
        'completed_at' => 'datetime',
        'is_bypass' => 'boolean',
    ];

    protected $appends = ['status_label', 'status_color'];

    // Status constants
    const STATUS_DIAJUKAN = 'diajukan';
    const STATUS_MENUNGGU_ADMIN = 'menunggu_review_admin';
    const STATUS_DISETUJUI_RT = 'disetujui_rt';
    const STATUS_DITOLAK_RT = 'ditolak_rt';
    const STATUS_DIPROSES_DESA = 'diproses_desa';
    const STATUS_MENUNGGU_KADES = 'menunggu_ttd_kades';
    const STATUS_SELESAI = 'selesai';
    const STATUS_DITOLAK = 'ditolak';
    const STATUS_DIBATALKAN = 'dibatalkan';

    public function letterType(): BelongsTo
    {
        return $this->belongsTo(LetterType::class);
    }

    public function pemohon(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pemohon_user_id');
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class, 'subject_resident_id');
    }

    public function wilayah(): BelongsTo
    {
        return $this->belongsTo(WilayahRtRw::class, 'wilayah_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(LetterRequestLog::class);
    }

    public function qrValidation(): HasOne
    {
        return $this->hasOne(QrValidation::class);
    }

    public function printedLetter(): HasOne
    {
        return $this->hasOne(PrintedLetter::class);
    }

    // Scopes
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByWilayah($query, int $wilayahId)
    {
        return $query->where('wilayah_id', $wilayahId);
    }

    public function scopePendingRtApproval($query)
    {
        return $query->where('status', self::STATUS_DIAJUKAN);
    }

    public function scopeReadyForProcess($query)
    {
        return $query->where('status', self::STATUS_DISETUJUI_RT);
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_DIAJUKAN => 'Diajukan',
            self::STATUS_MENUNGGU_ADMIN => 'Menunggu Review Admin',
            self::STATUS_DISETUJUI_RT => 'Disetujui RT/RW',
            self::STATUS_DITOLAK_RT => 'Ditolak RT/RW',
            self::STATUS_DIPROSES_DESA => 'Diproses Desa',
            self::STATUS_MENUNGGU_KADES => 'Menunggu TTD Kades',
            self::STATUS_SELESAI => 'Selesai',
            self::STATUS_DITOLAK => 'Ditolak',
            self::STATUS_DIBATALKAN => 'Dibatalkan',
            default => $this->status ?? 'Unknown',
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_DIAJUKAN => 'yellow',
            self::STATUS_MENUNGGU_ADMIN => 'orange',
            self::STATUS_DISETUJUI_RT => 'blue',
            self::STATUS_DITOLAK_RT => 'red',
            self::STATUS_DIPROSES_DESA => 'indigo',
            self::STATUS_MENUNGGU_KADES => 'purple',
            self::STATUS_SELESAI => 'green',
            self::STATUS_DITOLAK => 'red',
            self::STATUS_DIBATALKAN => 'gray',
            default => 'gray',
        };
    }
}
