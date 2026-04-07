<?php

namespace Database\Seeders;

use App\Models\VillageSetting;
use Illuminate\Database\Seeder;

class VillageSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'nama_desa', 'value' => 'Sukamaju', 'group' => 'general'],
            ['key' => 'kecamatan', 'value' => 'Cilacap Tengah', 'group' => 'general'],
            ['key' => 'kabupaten', 'value' => 'Cilacap', 'group' => 'general'],
            ['key' => 'provinsi', 'value' => 'Jawa Tengah', 'group' => 'general'],
            ['key' => 'kode_pos', 'value' => '53212', 'group' => 'general'],
            ['key' => 'alamat_kantor', 'value' => 'Jl. Raya Desa Sukamaju No. 1', 'group' => 'general'],
            ['key' => 'telepon', 'value' => '(0282) 123456', 'group' => 'general'],
            ['key' => 'email', 'value' => 'desa.sukamaju@gmail.com', 'group' => 'general'],
            ['key' => 'nama_kepala_desa', 'value' => 'H. Ahmad Subroto, S.Pd', 'group' => 'general'],
            ['key' => 'nip_kepala_desa', 'value' => '196801012000031001', 'group' => 'general'],
            ['key' => 'kode_desa', 'value' => '3301012001', 'group' => 'general'],

            // Surat Settings
            ['key' => 'format_nomor_surat', 'value' => '{NOMOR}/DS-{KODE_DESA}/{BULAN}/{TAHUN}', 'group' => 'surat'],
            ['key' => 'counter_surat', 'value' => '0', 'group' => 'surat'],
            ['key' => 'tahun_surat', 'value' => date('Y'), 'group' => 'surat'],

            // Display Settings
            ['key' => 'session_timeout', 'value' => '15', 'group' => 'display'],
            ['key' => 'items_per_page', 'value' => '15', 'group' => 'display'],
            ['key' => 'enable_otp_wa', 'value' => '0', 'group' => 'display'],
            ['key' => 'wa_gateway_url', 'value' => '', 'group' => 'display'],
            ['key' => 'wa_gateway_token', 'value' => '', 'group' => 'display'],
        ];

        foreach ($settings as $setting) {
            VillageSetting::create($setting);
        }
    }
}
