<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('family_cards', function (Blueprint $table) {
            $table->string('kode_pos', 10)->nullable()->after('alamat');
            $table->string('status_kepemilikan_bangunan')->nullable()->after('kode_pos');
            $table->string('jenis_lantai')->nullable()->after('status_kepemilikan_bangunan');
            $table->string('jenis_dinding')->nullable()->after('jenis_lantai');
            $table->string('fasilitas_sanitasi')->nullable()->after('jenis_dinding');
            $table->string('sumber_air_minum')->nullable()->after('fasilitas_sanitasi');
            $table->text('alamat_domisili')->nullable()->after('sumber_air_minum');
        });
    }

    public function down(): void
    {
        Schema::table('family_cards', function (Blueprint $table) {
            $table->dropColumn([
                'kode_pos',
                'status_kepemilikan_bangunan',
                'jenis_lantai',
                'jenis_dinding',
                'fasilitas_sanitasi',
                'sumber_air_minum',
                'alamat_domisili',
            ]);
        });
    }
};
