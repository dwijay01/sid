<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qr_validations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_request_id')->constrained('letter_requests')->cascadeOnDelete();
            $table->uuid('qr_code')->unique();
            $table->string('qr_image_path')->nullable();
            $table->foreignId('validated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('validated_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qr_validations');
    }
};
