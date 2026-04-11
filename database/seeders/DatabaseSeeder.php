<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            VillageSettingSeeder::class,
            WilayahSeeder::class,
            LetterTypeSeeder::class,
            AdminUserSeeder::class,
            // DemoDataSeeder::class, // Commented out to prevent seeding demo residents
        ]);
    }
}
