<?php

namespace Database\Seeders;

use App\Models\LetterTemplate;
use Illuminate\Database\Seeder;

class MutationTemplatesSeeder extends Seeder
{
    public function run(): void
    {
        // Birth Template
        LetterTemplate::updateOrCreate(
            ['name' => 'Surat Keterangan Kelahiran'],
            [
                'body_template' => '
                    <div style="text-align: center; font-weight: bold; margin-bottom: 20px;">
                        <h2 style="margin: 0; text-transform: uppercase;">Surat Keterangan Kelahiran</h2>
                        <div style="margin-top: 5px;">Nomor: ................................</div>
                    </div>
                    <div style="text-align: justify; line-height: 1.6;">
                        <p>Yang bertanda tangan di bawah ini, Kepala Desa SID, menerangkan bahwa pada hari ini:</p>
                        <table style="width: 100%; margin-left: 20px; border-collapse: collapse;">
                            <tr><td style="width: 25%;">Nama Bayi</td><td>: <b>{{nama}}</b></td></tr>
                            <tr><td>Jenis Kelamin</td><td>: {{jk}}</td></tr>
                            <tr><td>Tempat/Tgl Lahir</td><td>: {{tmp_lahir}}, {{tgl_lahir}}</td></tr>
                            <tr><td>Jam Lahir</td><td>: {{jam_lahir}} WIB</td></tr>
                            <tr><td>Berat/Panjang</td><td>: {{berat}} kg / {{panjang}} cm</td></tr>
                        </table>
                        <p style="margin-top: 15px;">Telah lahir dari pasangan orang tua:</p>
                        <table style="width: 100%; margin-left: 20px; border-collapse: collapse;">
                            <tr><td style="width: 25%;">NIK Ayah</td><td>: {{ayah_nik}}</td></tr>
                            <tr><td>NIK Ibu</td><td>: {{ibu_nik}}</td></tr>
                        </table>
                        <p style="margin-top: 15px;">Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
                    </div>'
            ]
        );

        // Death Template
        LetterTemplate::updateOrCreate(
            ['name' => 'Surat Keterangan Kematian'],
            [
                'body_template' => '
                    <div style="text-align: center; font-weight: bold; margin-bottom: 20px;">
                        <h2 style="margin: 0; text-transform: uppercase;">Surat Keterangan Kematian</h2>
                        <div style="margin-top: 5px;">Nomor: ................................</div>
                    </div>
                    <div style="text-align: justify; line-height: 1.6;">
                        <p>Yang bertanda tangan di bawah ini, Kepala Desa SID, menerangkan bahwa:</p>
                        <table style="width: 100%; margin-left: 20px; border-collapse: collapse;">
                            <tr><td style="width: 25%;">Nama</td><td>: <b>{{nama}}</b></td></tr>
                            <tr><td>NIK</td><td>: {{nik}}</td></tr>
                            <tr><td>Tempat/Tgl Lahir</td><td>: {{tmp_lahir}}, {{tgl_lahir}}</td></tr>
                            <tr><td>Jenis Kelamin</td><td>: {{jk}}</td></tr>
                            <tr><td>Alamat</td><td>: {{alamat}}</td></tr>
                        </table>
                        <p style="margin-top: 15px;">Telah meninggal dunia pada:</p>
                        <table style="width: 100%; margin-left: 20px; border-collapse: collapse;">
                            <tr><td style="width: 25%;">Hari/Tanggal</td><td>: {{tanggal_mati}}</td></tr>
                            <tr><td>Pukul</td><td>: {{jam_mati}} WIB</td></tr>
                            <tr><td>Tempat</td><td>: {{tempat_mati}}</td></tr>
                            <tr><td>Penyebab</td><td>: {{penyebab}}</td></tr>
                        </table>
                        <p style="margin-top: 15px;">Surat keterangan ini dibuat atas laporan dari pelapor dengan NIK: {{pelapor_nik}}.</p>
                        <p>Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
                    </div>'
            ]
        );
    }
}
