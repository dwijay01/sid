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
        Schema::table('internet_subscriptions', function (Blueprint $table) {
            $table->foreignId('resident_id')->after('id')->nullable()->constrained('residents')->nullOnDelete();
            $table->foreignId('family_card_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('internet_subscriptions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('resident_id');
            $table->foreignId('family_card_id')->nullable(false)->change();
        });
    }
};
