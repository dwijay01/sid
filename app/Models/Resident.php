<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resident extends Model
{
    use SoftDeletes;

    protected $appends = [];

    protected $fillable = [
        'family_card_id',
        'nik',
        'nama_lengkap',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'agama',
        'golongan_darah',
        'status_perkawinan',
        'pekerjaan',
        'pendidikan',
        'kewarganegaraan',
        'hubungan_keluarga',
        'no_paspor',
        'no_kitas',
        'alamat_sekarang',
        'status_penduduk',
        'needs_update',
        'foto',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    public function familyCard(): BelongsTo
    {
        return $this->belongsTo(FamilyCard::class, 'family_card_id');
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'resident_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ResidentDocument::class);
    }

    public function mutations(): HasMany
    {
        return $this->hasMany(PopulationMutation::class);
    }

    public function letterRequests(): HasMany
    {
        return $this->hasMany(LetterRequest::class, 'subject_resident_id');
    }

    public function getUsiaAttribute(): int
    {
        return $this->tanggal_lahir ? $this->tanggal_lahir->age : 0;
    }

    public function getAlamatLengkapAttribute(): string
    {
        $alamat = $this->alamat_sekarang;
        if (!$alamat && $this->familyCard) {
            $alamat = $this->familyCard->alamat;
        }
        return $alamat ?? '-';
    }

    public function rukemMember(): HasOne
    {
        return $this->hasOne(RukemMember::class);
    }

    public function umkm(): HasMany
    {
        return $this->hasMany(Umkm::class);
    }
}
