<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('umkm', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->string('nama_usaha');
            $table->enum('sektor_usaha', [
                'kuliner', 'jasa', 'perdagangan', 'pertanian',
                'kerajinan', 'teknologi', 'lainnya'
            ]);
            $table->boolean('alamat_sama_domisili')->default(true);
            $table->text('alamat_usaha')->nullable();
            $table->string('foto_tempat_usaha')->nullable();
            $table->boolean('memiliki_nib')->default(false);
            $table->string('nomor_nib', 50)->nullable();
            $table->enum('rentang_omzet', [
                'belum_ada', '<1jt', '1-5jt', '5-15jt', '15-50jt', '>50jt'
            ])->default('belum_ada');
            $table->enum('jumlah_karyawan', [
                '0', '1-4', '5-19', '20+'
            ])->default('0');
            $table->text('deskripsi')->nullable();
            $table->enum('status', ['aktif', 'nonaktif', 'tutup'])->default('aktif');
            $table->timestamps();

            $table->index('sektor_usaha');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('umkm');
    }
};
