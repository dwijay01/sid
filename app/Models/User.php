<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'nik',
        'no_kk',
        'phone',
        'password',
        'resident_id',
        'is_active',
        'wilayah_id',
        'pending_wilayah_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function letterRequests(): HasMany
    {
        return $this->hasMany(LetterRequest::class, 'pemohon_user_id');
    }

    public function managedWilayah(): HasOne
    {
        return $this->hasOne(WilayahRtRw::class, 'ketua_user_id');
    }

    public function wilayah(): BelongsTo
    {
        return $this->belongsTo(WilayahRtRw::class, 'wilayah_id');
    }

    public function pendingWilayah(): BelongsTo
    {
        return $this->belongsTo(WilayahRtRw::class, 'pending_wilayah_id');
    }

    /**
     * Get family members (warga with same KK number).
     */
    public function getFamilyMembersAttribute()
    {
        if (!$this->no_kk) {
            return collect();
        }

        $familyCard = FamilyCard::where('no_kk', $this->no_kk)->first();
        if (!$familyCard) {
            return collect();
        }

        return $familyCard->members;
    }

    /**
     * Check if user is Ketua RW.
     */
    public function isRw(): bool
    {
        return $this->hasRole('rw');
    }

    /**
     * Check if user is Ketua RT.
     */
    public function isRt(): bool
    {
        return $this->hasRole('rt');
    }

    /**
     * Check if user is RT/RW (legacy compat).
     */
    public function isRtRw(): bool
    {
        return $this->hasRole(['rt', 'rw']);
    }

    /**
     * Check if user is Sie Rukun Kematian.
     */
    public function isSieRukem(): bool
    {
        return $this->hasRole('sie_rukem');
    }

    /**
     * Check if user is Sie Pemberdayaan.
     */
    public function isSiePemberdayaan(): bool
    {
        return $this->hasRole('sie_pemberdayaan');
    }

    /**
     * Check if user is operator desa.
     */
    public function isOperator(): bool
    {
        return $this->hasRole('operator');
    }

    /**
     * Check if user is kepala desa.
     */
    public function isKades(): bool
    {
        return $this->hasRole('kades');
    }

    /**
     * Get the role-based dashboard route.
     */
    public function getDashboardRoute(): string
    {
        if ($this->isKades()) return 'kades.dashboard';
        if ($this->isOperator()) return 'admin.dashboard';
        if ($this->isRw()) return 'rw.dashboard';
        if ($this->isRt()) return 'rt.dashboard';
        if ($this->isSieRukem()) return 'sie-rukem.dashboard';
        if ($this->isSiePemberdayaan()) return 'sie-pemberdayaan.dashboard';
        return 'warga.dashboard';
    }

    /**
     * Get all wilayah under this RW user's managed area.
     */
    public function getManagedWilayahIds(): array
    {
        // Try to get wilayah from new wilayah_id column first
        $wilayah = $this->wilayah_id ? $this->wilayah : $this->managedWilayah;
        
        if (!$wilayah) return [];

        // If user is RW or Sie Pemberdayaan, get all wilayah in same RW
        if ($this->isRw() || $this->isSiePemberdayaan()) {
            return WilayahRtRw::where('rw', $wilayah->rw)->pluck('id')->toArray();
        }

        // If user is RT, get only their own wilayah
        return [$wilayah->id];
    }
}
