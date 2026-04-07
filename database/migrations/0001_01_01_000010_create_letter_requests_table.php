<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('letter_requests', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat')->unique()->nullable();
            $table->foreignId('letter_type_id')->constrained('letter_types');
            $table->foreignId('pemohon_user_id')->constrained('users');
            $table->foreignId('subject_resident_id')->constrained('residents');
            $table->foreignId('wilayah_id')->nullable()->constrained('wilayah_rt_rw')->nullOnDelete();
            $table->text('keperluan');
            $table->json('data_tambahan')->nullable();
            $table->enum('status', ['diajukan', 'disetujui_rt', 'ditolak_rt', 'diproses_desa', 'selesai', 'dibatalkan'])->default('diajukan');
            $table->text('catatan_penolakan')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->boolean('is_bypass')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letter_requests');
    }
};
