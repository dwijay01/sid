<?php

namespace Database\Seeders;

use App\Models\WilayahRtRw;
use Illuminate\Database\Seeder;

class WilayahSeeder extends Seeder
{
    public function run(): void
    {
        $wilayahList = [
            ['rt' => '001', 'rw' => '001', 'dusun' => 'Dusun Sukamaju'],
            ['rt' => '002', 'rw' => '001', 'dusun' => 'Dusun Sukamaju'],
            ['rt' => '003', 'rw' => '001', 'dusun' => 'Dusun Sukamaju'],
            ['rt' => '001', 'rw' => '002', 'dusun' => 'Dusun Mekar Sari'],
            ['rt' => '002', 'rw' => '002', 'dusun' => 'Dusun Mekar Sari'],
            ['rt' => '003', 'rw' => '002', 'dusun' => 'Dusun Mekar Sari'],
            ['rt' => '001', 'rw' => '003', 'dusun' => 'Dusun Cempaka'],
            ['rt' => '002', 'rw' => '003', 'dusun' => 'Dusun Cempaka'],
        ];

        foreach ($wilayahList as $wilayah) {
            WilayahRtRw::create(array_merge($wilayah, ['is_active' => true]));
        }
    }
}
