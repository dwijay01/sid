<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->foreignId('wilayah_id')->nullable()->constrained('wilayah_rt_rw')->nullOnDelete();
        });

        // Populate existing residents' wilayah_id from their family card
        DB::statement("
            UPDATE residents r
            INNER JOIN family_cards fc ON r.family_card_id = fc.id
            SET r.wilayah_id = fc.wilayah_id
            WHERE r.family_card_id IS NOT NULL
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->dropForeign(['wilayah_id']);
            $table->dropColumn('wilayah_id');
        });
    }
};
