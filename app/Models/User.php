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
     * Check if user is RT/RW chief.
     */
    public function isRtRw(): bool
    {
        return $this->hasRole('rt_rw');
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
        if ($this->isRtRw()) return 'rtrw.dashboard';
        return 'warga.dashboard';
    }
}
