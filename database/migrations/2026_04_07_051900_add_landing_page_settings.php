<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\VillageSetting;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            ['key' => 'sambutan_kades', 'value' => 'Assalamu\'alaikum Wr. Wb. Puji syukur kami panjatkan kepada Allah SWT atas segala rahmat dan hidayah-Nya. Dengan hadirnya Sistem Informasi Desa ini, kami berharap pelayanan administrasi desa dapat lebih mudah, cepat, dan transparan bagi seluruh warga.', 'group' => 'landing'],
            ['key' => 'visi', 'value' => 'Mewujudkan Desa Sukamaju yang Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Baik dan Transparan.', 'group' => 'landing'],
            ['key' => 'misi', 'value' => "Meningkatkan kualitas pelayanan publik yang cepat, tepat, dan transparan\nMendorong pembangunan infrastruktur desa yang merata dan berkelanjutan\nMeningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan\nMemberdayakan potensi ekonomi lokal dan kearifan budaya desa\nMewujudkan tata kelola pemerintahan desa yang bersih dan akuntabel", 'group' => 'landing'],
            ['key' => 'sejarah_desa', 'value' => 'Desa Sukamaju merupakan salah satu desa yang terletak di Kecamatan Cilacap Tengah, Kabupaten Cilacap, Provinsi Jawa Tengah. Desa ini memiliki sejarah panjang dan kaya akan budaya serta tradisi lokal yang masih terjaga hingga saat ini. Dengan luas wilayah yang cukup luas dan penduduk yang beragam, Desa Sukamaju terus berkembang menjadi desa yang mandiri dan sejahtera.', 'group' => 'landing'],
            ['key' => 'foto_kades', 'value' => '', 'group' => 'landing'],
            ['key' => 'foto_kantor_desa', 'value' => '', 'group' => 'landing'],
            ['key' => 'landing_hero_tagline', 'value' => 'Melayani dengan Sepenuh Hati untuk Kesejahteraan Warga', 'group' => 'landing'],
        ];

        foreach ($settings as $setting) {
            VillageSetting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value'], 'group' => $setting['group']]
            );
        }
    }

    public function down(): void
    {
        VillageSetting::whereIn('key', [
            'sambutan_kades', 'visi', 'misi', 'sejarah_desa',
            'foto_kades', 'foto_kantor_desa', 'landing_hero_tagline',
        ])->delete();
    }
};
