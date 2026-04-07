<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $letter->letterType->nama_surat }}</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            color: #000;
        }
        .container {
            padding: 40px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
            position: relative;
        }
        .header h1 {
            margin: 0;
            font-size: 16pt;
            text-transform: uppercase;
        }
        .header h2 {
            margin: 0;
            font-size: 14pt;
        }
        .header p {
            margin: 0;
            font-size: 10pt;
        }
        .title {
            text-align: center;
            margin-bottom: 20px;
        }
        .title h3 {
            margin: 0;
            font-size: 14pt;
            text-decoration: underline;
            text-transform: uppercase;
        }
        .title p {
            margin: 0;
            font-size: 12pt;
        }
        .content {
            text-align: justify;
        }
        .table-data {
            width: 100%;
            margin-top: 10px;
            margin-bottom: 15px;
            margin-left: 20px;
        }
        .table-data td {
            padding: 3px;
            vertical-align: top;
        }
        .table-data .label {
            width: 150px;
        }
        .table-data .colon {
            width: 10px;
        }
        .signature-area {
            margin-top: 50px;
            width: 100%;
        }
        .signature-box {
            float: right;
            width: 300px;
            text-align: center;
        }
        .qr-code {
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .qr-code img {
            width: 100px;
            height: 100px;
        }
        .footer {
            clear: both;
            margin-top: 50px;
            font-size: 9pt;
            color: #555;
            border-top: 1px solid #ccc;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Space for Logo, we can base64 encode later -->
            <h1>Pemerintah Kabupaten SIDOARJO</h1>
            <h2>Kecamatan TANGGULANGIN</h2>
            <h1>Desa KEDENSARI</h1>
            <p>Alamat: Jl. Raya Kedensari No.1 Telp. (031) 895xxxx Kode Pos 61272</p>
        </div>

        <div class="title">
            <h3>{{ $letter->letterType->nama_surat }}</h3>
            <p>Nomor: {{ $letter->nomor_surat ?? '......./......../........' }}</p>
        </div>

        <div class="content">
            <p>Yang bertanda tangan di bawah ini Kepala Desa Kedensari, Kecamatan Tanggulangin, Kabupaten Sidoarjo, menerangkan dengan sebenarnya bahwa:</p>
            
            <table class="table-data">
                <tr>
                    <td class="label">Nama Lengkap</td>
                    <td class="colon">:</td>
                    <td><strong>{{ strtoupper($resident->nama_lengkap) }}</strong></td>
                </tr>
                <tr>
                    <td class="label">NIK</td>
                    <td class="colon">:</td>
                    <td>{{ $resident->nik }}</td>
                </tr>
                <tr>
                    <td class="label">Tempat, Tgl Lahir</td>
                    <td class="colon">:</td>
                    <td>{{ $resident->tempat_lahir }}, {{ \Carbon\Carbon::parse($resident->tanggal_lahir)->translatedFormat('d F Y') }}</td>
                </tr>
                <tr>
                    <td class="label">Jenis Kelamin</td>
                    <td class="colon">:</td>
                    <td>{{ $resident->jenis_kelamin == 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                </tr>
                <tr>
                    <td class="label">Pekerjaan</td>
                    <td class="colon">:</td>
                    <td>{{ $resident->pekerjaan ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Agama</td>
                    <td class="colon">:</td>
                    <td>{{ $resident->agama }}</td>
                </tr>
                <tr>
                    <td class="label">Alamat</td>
                    <td class="colon">:</td>
                    <td>{{ $resident->alamat_sekarang ?? ($resident->familyCard->alamat ?? '-') }}</td>
                </tr>
            </table>

            <p>Orang tersebut di atas adalah benar-benar warga Desa Kedensari yang bertempat tinggal di alamat tersebut. Maksud dari permohonan ini adalah untuk keperluan:</p>
            <p style="text-align: center; font-weight: bold; margin: 15px 0;">"{{ $letter->keperluan }}"</p>
            
            @if($letter->keterangan_tambahan)
            <p>Keterangan Tambahan: {{ $letter->keterangan_tambahan }}</p>
            @endif

            <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.</p>
        </div>

        <div class="signature-area">
            <div class="signature-box">
                <p>Kedensari, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</p>
                <p><strong>Kepala Desa Kedensari</strong></p>
                <br>
                @if($qrCodeUrl)
                <div class="qr-code">
                    <img src="{{ $qrCodeUrl }}" alt="QR Code TTE">
                    <br>
                    <span style="font-size: 8pt; color:#666;">Ditandatangani secara elektronik. Pindai untuk verifikasi.</span>
                </div>
                @else
                <br><br><br><br>
                @endif
                <p style="text-decoration: underline; font-weight: bold;">( Nama Kepala Desa )</p>
            </div>
        </div>

        <div class="footer">
            Surat ini dicetak secara otomatis dari Sistem Informasi Kependudukan Desa (SID) pada {{ now()->format('d/m/Y H:i:s') }}.<br>
            Untuk memastikan keabsahan dokumen, pindai QR Code atau kunjungi situs resmi verifikasi desa.
        </div>
    </div>
</body>
</html>
