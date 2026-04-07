<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add foreign key from users to residents
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('resident_id')->references('id')->on('residents')->nullOnDelete();
        });

        // Add foreign key from family_cards to residents (kepala keluarga)
        // Deferred because residents references family_cards and vice versa
        Schema::table('family_cards', function (Blueprint $table) {
            $table->foreign('kepala_keluarga_id')->references('id')->on('residents')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('family_cards', function (Blueprint $table) {
            $table->dropForeign(['kepala_keluarga_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['resident_id']);
        });
    }
};
