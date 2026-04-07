<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('population_mutations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->enum('type', ['lahir', 'mati', 'pindah_keluar', 'pindah_masuk', 'datang']);
            $table->date('tanggal_mutasi');
            $table->text('keterangan')->nullable();
            $table->string('asal_tujuan')->nullable();
            $table->string('no_surat_mutasi')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('population_mutations');
    }
};
