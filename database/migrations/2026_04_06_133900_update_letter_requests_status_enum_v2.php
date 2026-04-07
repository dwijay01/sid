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
        DB::statement("ALTER TABLE letter_requests MODIFY COLUMN status ENUM('diajukan', 'disetujui_rt', 'menunggu_review_admin', 'diproses_desa', 'menunggu_ttd_kades', 'selesai', 'ditolak', 'ditolak_rt', 'dibatalkan') DEFAULT 'diajukan'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE letter_requests MODIFY COLUMN status ENUM('diajukan', 'disetujui_rt', 'ditolak_rt', 'diproses_desa', 'selesai', 'dibatalkan') DEFAULT 'diajukan'");
    }
};
