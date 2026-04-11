<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@sid.test'],
            [
                'name' => 'Administrator SID',
                'nik' => '3300000000000001',
                'phone' => '080000000000',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );

        // Assign operator role for full administrative access
        $admin->syncRoles(['operator']);
    }
}
