<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('family_cards', function (Blueprint $table) {
            $table->string('kategori_aktif')->default('aktif')->after('status')->comment('aktif, kurang_mampu, tidak_aktif');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('family_cards', function (Blueprint $table) {
            $table->dropColumn('kategori_aktif');
        });
    }
};
