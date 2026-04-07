<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wilayah_rt_rw', function (Blueprint $table) {
            $table->id();
            $table->string('rt', 5);
            $table->string('rw', 5);
            $table->string('dusun')->nullable();
            $table->string('nama_ketua')->nullable();
            $table->foreignId('ketua_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['rt', 'rw']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wilayah_rt_rw');
    }
};
