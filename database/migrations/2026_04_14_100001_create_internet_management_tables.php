<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internet_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_card_id')->constrained('family_cards')->cascadeOnDelete();
            $table->string('package_name'); // e.g. 10 Mbps, 20 Mbps
            $table->date('installation_date');
            $table->string('access_point_location')->nullable();
            $table->enum('status', ['aktif', 'isolir', 'berhenti'])->default('aktif');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
        });

        Schema::create('internet_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internet_subscription_id')->constrained('internet_subscriptions')->cascadeOnDelete();
            $table->unsignedTinyInteger('month'); // 1-12
            $table->unsignedSmallInteger('year');
            $table->decimal('amount', 12, 2)->default(0);
            $table->enum('status', ['lunas', 'tunggakan'])->default('tunggakan');
            $table->date('payment_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['internet_subscription_id', 'month', 'year'], 'payment_period_unique');
            $table->index(['month', 'year']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internet_payments');
        Schema::dropIfExists('internet_subscriptions');
    }
};
