<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_card_id')->nullable()->constrained('family_cards')->nullOnDelete();
            $table->string('nik', 16)->unique();
            $table->string('nama_lengkap');
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->enum('agama', ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'])->default('Islam');
            $table->enum('golongan_darah', ['A', 'B', 'AB', 'O', 'tidak_tahu'])->default('tidak_tahu');
            $table->enum('status_perkawinan', ['belum_kawin', 'kawin', 'cerai_hidup', 'cerai_mati'])->default('belum_kawin');
            $table->string('pekerjaan')->nullable();
            $table->enum('pendidikan', ['tidak_sekolah', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'])->default('tidak_sekolah');
            $table->string('kewarganegaraan', 10)->default('WNI');
            $table->enum('hubungan_keluarga', ['kepala', 'istri', 'anak', 'menantu', 'cucu', 'orang_tua', 'mertua', 'famili_lain', 'lainnya'])->default('kepala');
            $table->string('no_paspor')->nullable();
            $table->string('no_kitas')->nullable();
            $table->text('alamat_sekarang')->nullable();
            $table->enum('status_penduduk', ['aktif', 'meninggal', 'pindah', 'hilang'])->default('aktif');
            $table->string('foto')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
