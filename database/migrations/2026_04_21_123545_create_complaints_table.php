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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained()->onDelete('cascade');
            $table->foreignId('wilayah_id')->constrained('wilayah_rt_rw')->onDelete('cascade');
            
            $table->string('title');
            $table->string('category'); // infrastruktur, keamanan, ketertiban, kesehatan, layanan, lainnya
            $table->text('description');
            $table->string('attachment_path')->nullable();
            
            // Statuses: menunggu, diproses_rt, diteruskan_rw, selesai, ditolak
            $table->string('status')->default('menunggu');
            
            $table->text('rt_response')->nullable();
            $table->text('rw_response')->nullable();
            
            $table->boolean('is_secret')->default(false); // If true, do not expose name publicly (if we make an open board)
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
