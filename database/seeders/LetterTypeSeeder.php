<?php

namespace Database\Seeders;

use App\Models\LetterTemplate;
use App\Models\LetterType;
use Illuminate\Database\Seeder;

class LetterTypeSeeder extends Seeder
{
    public function run(): void
    {
        // Create default templates
        $templatePengantar = LetterTemplate::create([
            'name' => 'Template Surat Pengantar',
            'body_template' => $this->getTemplatePengantar(),
        ]);

        $templateKeterangan = LetterTemplate::create([
            'name' => 'Template Surat Keterangan',
            'body_template' => $this->getTemplateKeterangan(),
        ]);

        $templateDomisili = LetterTemplate::create([
            'name' => 'Template Surat Keterangan Domisili',
            'body_template' => $this->getTemplateDomisili(),
        ]);

        // Create letter types
        $types = [
            [
                'name' => 'Surat Pengantar',
                'code' => 'SP',
                'description' => 'Surat pengantar untuk berbagai keperluan administrasi',
                'template_id' => $templatePengantar->id,
                'requires_rt_approval' => true,
            ],
            [
                'name' => 'Surat Keterangan Domisili',
                'code' => 'SKD',
                'description' => 'Surat keterangan tempat tinggal/domisili warga',
                'template_id' => $templateDomisili->id,
                'requires_rt_approval' => true,
            ],
            [
                'name' => 'Surat Keterangan Tidak Mampu',
                'code' => 'SKTM',
                'description' => 'Surat keterangan untuk warga tidak mampu',
                'template_id' => $templateKeterangan->id,
                'requires_rt_approval' => true,
            ],
            [
                'name' => 'Surat Keterangan Usaha',
                'code' => 'SKU',
                'description' => 'Surat keterangan memiliki usaha',
                'template_id' => $templateKeterangan->id,
                'requires_rt_approval' => true,
            ],
            [
                'name' => 'Surat Keterangan Belum Menikah',
                'code' => 'SKBM',
                'description' => 'Surat keterangan status belum menikah',
                'template_id' => $templateKeterangan->id,
                'requires_rt_approval' => true,
            ],
            [
                'name' => 'Surat Pengantar SKCK',
                'code' => 'SKCK',
                'description' => 'Surat pengantar untuk pembuatan SKCK di kepolisian',
                'template_id' => $templatePengantar->id,
                'requires_rt_approval' => true,
            ],
            [
                'name' => 'Surat Keterangan Kematian',
                'code' => 'SKK',
                'description' => 'Surat keterangan meninggal dunia',
                'template_id' => $templateKeterangan->id,
                'requires_rt_approval' => true,
            ],
            [
                'name' => 'Surat Keterangan Kelahiran',
                'code' => 'SKLH',
                'description' => 'Surat keterangan kelahiran bayi',
                'template_id' => $templateKeterangan->id,
                'requires_rt_approval' => false,
            ],
            [
                'name' => 'Surat Pengantar Pindah',
                'code' => 'SPP',
                'description' => 'Surat pengantar untuk pindah domisili',
                'template_id' => $templatePengantar->id,
                'requires_rt_approval' => true,
            ],
            [
                'name' => 'Surat Keterangan Lainnya',
                'code' => 'SKL',
                'description' => 'Surat keterangan untuk keperluan lainnya',
                'template_id' => $templateKeterangan->id,
                'requires_rt_approval' => true,
            ],
        ];

        foreach ($types as $type) {
            LetterType::create($type);
        }
    }

    private function getTemplatePengantar(): string
    {
        return <<<'HTML'
<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h3 style="margin: 0;">SURAT PENGANTAR</h3>
        <p style="margin: 0;">Nomor: {{nomor_surat}}</p>
    </div>

    <p>Yang bertanda tangan di bawah ini, Kepala Desa {{nama_desa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>

    <table style="margin-left: 40px; margin-bottom: 15px;">
        <tr><td style="width: 180px;">Nama Lengkap</td><td>: {{nama_lengkap}}</td></tr>
        <tr><td>NIK</td><td>: {{nik}}</td></tr>
        <tr><td>Tempat/Tgl Lahir</td><td>: {{tempat_lahir}}, {{tanggal_lahir}}</td></tr>
        <tr><td>Jenis Kelamin</td><td>: {{jenis_kelamin}}</td></tr>
        <tr><td>Agama</td><td>: {{agama}}</td></tr>
        <tr><td>Pekerjaan</td><td>: {{pekerjaan}}</td></tr>
        <tr><td>Alamat</td><td>: {{alamat}}</td></tr>
    </table>

    <p>Adalah benar warga Desa {{nama_desa}} yang beralamat sebagaimana tersebut di atas.</p>
    <p><strong>Keperluan:</strong> {{keperluan}}</p>

    <p>Demikian surat pengantar ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>

    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="text-align: center;">
            <p>Mengetahui,</p>
            <p>Ketua RT {{rt}} / RW {{rw}}</p>
            <br><br><br>
            <p style="text-decoration: underline;">{{nama_ketua_rt}}</p>
        </div>
        <div style="text-align: center;">
            <p>{{nama_desa}}, {{tanggal_surat}}</p>
            <p>Kepala Desa {{nama_desa}}</p>
            <br><br><br>
            <p style="text-decoration: underline;">{{nama_kepala_desa}}</p>
        </div>
    </div>

    <div style="margin-top: 20px; text-align: center;">
        <p style="font-size: 9pt; color: #666;">Dokumen ini divalidasi secara digital</p>
        {{qr_code}}
    </div>
</div>
HTML;
    }

    private function getTemplateKeterangan(): string
    {
        return <<<'HTML'
<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h3 style="margin: 0;">SURAT KETERANGAN</h3>
        <p style="margin: 0;">Nomor: {{nomor_surat}}</p>
    </div>

    <p>Yang bertanda tangan di bawah ini, Kepala Desa {{nama_desa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, Provinsi {{provinsi}}, dengan ini menerangkan bahwa:</p>

    <table style="margin-left: 40px; margin-bottom: 15px;">
        <tr><td style="width: 180px;">Nama Lengkap</td><td>: {{nama_lengkap}}</td></tr>
        <tr><td>NIK</td><td>: {{nik}}</td></tr>
        <tr><td>Tempat/Tgl Lahir</td><td>: {{tempat_lahir}}, {{tanggal_lahir}}</td></tr>
        <tr><td>Jenis Kelamin</td><td>: {{jenis_kelamin}}</td></tr>
        <tr><td>Agama</td><td>: {{agama}}</td></tr>
        <tr><td>Status Perkawinan</td><td>: {{status_perkawinan}}</td></tr>
        <tr><td>Pekerjaan</td><td>: {{pekerjaan}}</td></tr>
        <tr><td>Alamat</td><td>: {{alamat}}</td></tr>
    </table>

    <p>Orang tersebut di atas adalah benar-benar warga Desa {{nama_desa}} dan berdasarkan sepengetahuan kami bahwa yang bersangkutan berkelakuan baik.</p>

    <p><strong>Keperluan:</strong> {{keperluan}}</p>

    <p>Demikian surat keterangan ini dibuat dengan sebenarnya dan untuk dipergunakan sebagaimana mestinya.</p>

    <div style="text-align: right; margin-top: 40px;">
        <p>{{nama_desa}}, {{tanggal_surat}}</p>
        <p>Kepala Desa {{nama_desa}}</p>
        <br><br><br>
        <p style="text-decoration: underline;">{{nama_kepala_desa}}</p>
    </div>

    <div style="margin-top: 20px; text-align: center;">
        <p style="font-size: 9pt; color: #666;">Dokumen ini divalidasi secara digital</p>
        {{qr_code}}
    </div>
</div>
HTML;
    }

    private function getTemplateDomisili(): string
    {
        return <<<'HTML'
<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h3 style="margin: 0;">SURAT KETERANGAN DOMISILI</h3>
        <p style="margin: 0;">Nomor: {{nomor_surat}}</p>
    </div>

    <p>Yang bertanda tangan di bawah ini, Kepala Desa {{nama_desa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, Provinsi {{provinsi}}, menerangkan dengan sesungguhnya bahwa:</p>

    <table style="margin-left: 40px; margin-bottom: 15px;">
        <tr><td style="width: 180px;">Nama Lengkap</td><td>: {{nama_lengkap}}</td></tr>
        <tr><td>NIK</td><td>: {{nik}}</td></tr>
        <tr><td>Tempat/Tgl Lahir</td><td>: {{tempat_lahir}}, {{tanggal_lahir}}</td></tr>
        <tr><td>Jenis Kelamin</td><td>: {{jenis_kelamin}}</td></tr>
        <tr><td>Agama</td><td>: {{agama}}</td></tr>
        <tr><td>Pekerjaan</td><td>: {{pekerjaan}}</td></tr>
        <tr><td>No. KK</td><td>: {{no_kk}}</td></tr>
        <tr><td>Alamat</td><td>: {{alamat}}</td></tr>
        <tr><td>RT / RW</td><td>: {{rt}} / {{rw}}</td></tr>
    </table>

    <p>Orang tersebut di atas benar-benar berdomisili di alamat tersebut dan tercatat sebagai warga Desa {{nama_desa}}.</p>

    <p><strong>Keperluan:</strong> {{keperluan}}</p>

    <p>Demikian surat keterangan domisili ini dibuat dengan sebenarnya, untuk dipergunakan sebagaimana mestinya.</p>

    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="text-align: center;">
            <p>Mengetahui,</p>
            <p>Ketua RT {{rt}} / RW {{rw}}</p>
            <br><br><br>
            <p style="text-decoration: underline;">{{nama_ketua_rt}}</p>
        </div>
        <div style="text-align: center;">
            <p>{{nama_desa}}, {{tanggal_surat}}</p>
            <p>Kepala Desa {{nama_desa}}</p>
            <br><br><br>
            <p style="text-decoration: underline;">{{nama_kepala_desa}}</p>
        </div>
    </div>

    <div style="margin-top: 20px; text-align: center;">
        <p style="font-size: 9pt; color: #666;">Dokumen ini divalidasi secara digital</p>
        {{qr_code}}
    </div>
</div>
HTML;
    }
}
