<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resident_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->string('category'); // e.g. Jasa, Teknik, Pendidikan, dll
            $table->string('skill_name');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('category');
            $table->index('skill_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resident_skills');
    }
};
