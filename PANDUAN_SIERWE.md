# 📘 Buku Panduan Pengguna SIERWE
**Sistem Informasi RT-RW (Digital Village Administration)**

Selamat datang di panduan resmi penggunaan aplikasi **SIERWE**. Dokumen ini dirancang untuk membantu setiap kategori pengguna dalam mengoperasikan sistem sesuai dengan hak akses masing-masing.

---

## 📋 Daftar Isi
1. [Pengenalan Sistem](#1-pengenalan-sistem)
2. [Panduan: Admin (Operator Desa)](#2-admin--operator-desa)
3. [Panduan: Ketua RW](#3-ketua-rw)
4. [Panduan: Ketua RT](#4-ketua-rt)
5. [Panduan: Sie Rukun Kematian](#5-sie-rukun-kematian)
6. [Panduan: Warga / Kepala KK](#6-warga--kepala-kk)
7. [Prosedur Khusus: Mutasi](#7-prosedur-khusus)

---

## 1. Pengenalan Sistem
SIERWE adalah platform digital untuk memudahkan administrasi kependudukan di tingkat RT/RW dan Desa. Sistem ini mengintegrasikan data penduduk, kartu keluarga, mutasi (lahir/mati/pindah), persuratan, hingga pendataan UMKM.

### Akses Umum
- **URL**: `http://localhost:8000` (atau URL server yang disediakan)
- **Login**: Menggunakan NIK/Email dan Password.
- **Lupa Password**: Hubungi Admin Desa jika Anda tidak dapat mengakses akun.

---

## 2. Admin / Operator Desa
Peran ini memiliki kontrol penuh atas master data dan konfigurasi sistem.

### 2.1 Manajemen Penduduk & KK
- **Input Data**: Tambah data penduduk secara manual melalui menu **Kependudukan**.
- **Import Excel**: Gunakan fitur **Import** di halaman list penduduk. 
    > [!TIP]
    > Sistem otomatis mengenali Keluarga (KK) jika nomor KK sama. Jika tanggal lahir kosong, sistem akan menandai data tersebut dengan badge **"Update"** untuk diperbaiki nanti.
- **Log Import**: Pantau riwayat import di menu **Log Import**. Di sini Anda bisa melihat detail data yang gagal/dilewati (misal karena NIK duplikat).

### 2.2 Pengaturan Persuratan
- **Jenis Surat**: Tambahkan jenis pelayanan surat (misal: Surat Pengantar KTP).
- **Template Surat**: Gunakan editor WYSIWYG untuk membuat template surat. Anda bisa memasukkan variabel dinamis seperti `{{nama}}`, `{{nik}}`, `{{rt}}`, dll.

### 2.3 Konfigurasi Wilayah & Akun
- **Wilayah RT/RW**: Daftarkan wilayah dan hubungkan Ketua RT/RW ke wilayah tersebut.
- **Manajemen User**: Kelola semua akun pengguna, termasuk menyetujui pendaftaran Ketua RT/RW yang mendaftar mandiri.

---

## 3. Ketua RW
Bertindak sebagai koordinator di wilayah Rukun Warga.

### 3.1 Manajemen Kewilayahan
- **Persetujuan Akun RT**: Memberikan persetujuan (Approve) bagi warga/Ketua RT baru yang mendaftar akun di wilayahnya.
- **Monitoring RT**: Melihat ringkasan data kependudukan dan kegiatan administrasi di seluruh RT yang berada di bawah naungannya.

---

## 4. Ketua RT
Peran paling aktif dalam pemutakhiran data warga di lapangan.

### 4.1 Pengelolaan Warga & KK
- **Tambah Warga**: Menambahkan warga baru ke RT-nya secara mandiri.
- **Quick Kartu Keluarga**: Menambahkan data Kartu Keluarga dengan cepat beserta daftar anggotanya.
- **Update Data**: Memperbaiki data warga yang ditandai **"Needs Update"** (biasanya data hasil import yang tidak lengkap).

### 4.2 Mutasi Penduduk
- **Lahir/Mati**: Mencatat peristiwa kelahiran (otomatis masuk KK) dan kematian (otomatis mengubah status warga).
- **Pindah**: Mencatat warga yang pindah keluar atau warga baru yang pindah datang ke wilayah RT.

---

## 5. Sie Rukun Kematian
Mengelola program sosial kematian berbasis Kartu Keluarga.

### 5.1 Manajemen Anggota Rukem
- **Status Keanggotaan**: Mengelola status warga (Aktif, Nonaktif, Khusus, Keluar, Tidak Ikut).
- **Iuran/Laporan**: Memantau partisipasi warga dalam kegiatan rukun kematian di wilayah terkait.

---

## 6. Warga / Kepala KK
Layanan mandiri untuk efisiensi urusan administrasi.

### 6.1 Permohonan Surat Online
- Warga bisa mengajukan permohonan surat (misal: Surat Pengantar) kapan saja melalui HP/Laptop.
- **Tracking**: Memantau status surat (Menunggu RT -> Diproses Desa -> Selesai).
- **Download**: Mengunduh surat yang sudah bertanda tangan digital (jika diaktifkan) dalam bentuk PDF.

---

## 7. Prosedur Khusus

### 7.1 Alur Mutasi Lahir
1. Ketua RT masuk menu **Mutasi** -> **Tambah Lahir**.
2. Pilih nomor KK keluarga terkait.
3. Masukkan data bayi. Jika NIK belum ada, sistem akan memberikan NIK sementara.
4. Simpan, dan data bayi otomatis muncul sebagai anggota baru di KK tersebut.

---
> [!IMPORTANT]
> **Keamanan Data**: Jaga kerahasiaan password Anda. Selalu logout setelah menggunakan aplikasi di komputer publik.

**Tim Support SIERWE**
*Hubungi Admin Desa untuk bantuan teknis lebih lanjut.*
