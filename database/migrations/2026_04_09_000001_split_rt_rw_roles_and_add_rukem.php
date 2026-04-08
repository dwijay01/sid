<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create rukem_members table
        Schema::create('rukem_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->string('nomor_anggota')->nullable()->unique();
            $table->date('tanggal_gabung');
            $table->enum('status_keanggotaan', ['aktif', 'nonaktif', 'keluar'])->default('aktif');
            $table->string('keterangan')->nullable();
            $table->timestamps();

            $table->index('status_keanggotaan');
        });

        // 2. Migrate existing rt_rw role to rt
        // Users with old rt_rw role will become rt by default
        $oldRole = DB::table('roles')->where('name', 'rt_rw')->first();
        if ($oldRole) {
            // Create new roles if they don't exist
            $rtRole = DB::table('roles')->where('name', 'rt')->first();
            if (!$rtRole) {
                DB::table('roles')->insert([
                    'name' => 'rt',
                    'guard_name' => 'web',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $rtRole = DB::table('roles')->where('name', 'rt')->first();
            }

            // Move model_has_roles from rt_rw to rt
            DB::table('model_has_roles')
                ->where('role_id', $oldRole->id)
                ->update(['role_id' => $rtRole->id]);

            // Move role_has_permissions from rt_rw to rt
            DB::table('role_has_permissions')
                ->where('role_id', $oldRole->id)
                ->update(['role_id' => $rtRole->id]);

            // Delete old rt_rw role
            DB::table('roles')->where('id', $oldRole->id)->delete();
        }
    }

    public function down(): void
    {
        // Reverse: rename rt back to rt_rw
        $rtRole = DB::table('roles')->where('name', 'rt')->first();
        if ($rtRole) {
            DB::table('roles')->where('id', $rtRole->id)->update(['name' => 'rt_rw']);
        }

        // Delete rw and sie_rukem roles
        DB::table('roles')->whereIn('name', ['rw', 'sie_rukem'])->delete();

        Schema::dropIfExists('rukem_members');
    }
};
