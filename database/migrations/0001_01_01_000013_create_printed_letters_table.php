<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('printed_letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_request_id')->constrained('letter_requests')->cascadeOnDelete();
            $table->string('nomor_surat');
            $table->string('file_path');
            $table->foreignId('printed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('printed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('printed_letters');
    }
};
