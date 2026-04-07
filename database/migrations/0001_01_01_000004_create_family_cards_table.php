<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('family_cards', function (Blueprint $table) {
            $table->id();
            $table->string('no_kk', 16)->unique();
            $table->unsignedBigInteger('kepala_keluarga_id')->nullable();
            $table->foreignId('wilayah_id')->nullable()->constrained('wilayah_rt_rw')->nullOnDelete();
            $table->text('alamat');
            $table->enum('status', ['aktif', 'pindah', 'pecah'])->default('aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_cards');
    }
};
