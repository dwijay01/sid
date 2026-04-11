<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // We might want to clear or update existing rukem members if any, 
        // but since this is a schema change, we can just alter it and let foreign keys handle the rest.
        // Given that resident_id and family_card_id are both foreign keys, we'll drop and add.
        // It's safer to truncate if data isn't matching, but we'll try to just recreate the column.
        
        // Let's drop the whole table and recreate it since we are radically changing it
        // and wiping existing records based on residents is expected if data needs re-linking.
        Schema::dropIfExists('rukem_members');

        Schema::create('rukem_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_card_id')->constrained('family_cards')->cascadeOnDelete();
            $table->string('nomor_anggota')->nullable()->unique();
            $table->date('tanggal_gabung');
            // Include tidak_ikut and khusus
            $table->enum('status_keanggotaan', ['aktif', 'nonaktif', 'khusus', 'keluar', 'tidak_ikut'])->default('aktif');
            $table->string('keterangan')->nullable();
            $table->timestamps();

            $table->index('status_keanggotaan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rukem_members');

        // Recreate old table
        Schema::create('rukem_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->string('nomor_anggota')->nullable()->unique();
            $table->date('tanggal_gabung');
            $table->enum('status_keanggotaan', ['aktif', 'nonaktif', 'keluar'])->default('aktif');
            $table->string('keterangan')->nullable();
            $table->timestamps();

            $table->index('status_keanggotaan');
        });
    }
};
