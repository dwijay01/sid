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
        Schema::table('residents', function (Blueprint $table) {
            $table->date('tanggal_lahir')->nullable()->change();
            $table->boolean('needs_update')->default(false)->after('status_penduduk');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->date('tanggal_lahir')->nullable(false)->change();
            $table->dropColumn('needs_update');
        });
    }
};
