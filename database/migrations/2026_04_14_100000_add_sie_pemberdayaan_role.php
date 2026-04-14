<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add sie_pemberdayaan role to Spatie roles table
        DB::table('roles')->insertOrIgnore([
            'name' => 'sie_pemberdayaan',
            'guard_name' => 'web',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('roles')->where('name', 'sie_pemberdayaan')->delete();
    }
};
