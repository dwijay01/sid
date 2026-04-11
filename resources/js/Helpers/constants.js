/**
 * Letter request status labels and colors
 */
export const STATUS_LABELS = {
    diajukan: 'Diajukan',
    disetujui_rt: 'Disetujui RT',
    ditolak_rt: 'Ditolak RT',
    diproses_desa: 'Diproses Desa',
    menunggu_ttd_kades: 'Menunggu TTD Kades',
    menunggu_review_admin: 'Menunggu Review Admin',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
    ditolak: 'Ditolak',
};

export const STATUS_COLORS = {
    diajukan: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    disetujui_rt: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    ditolak_rt: 'bg-red-50 text-red-700 ring-red-600/20',
    diproses_desa: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
    menunggu_ttd_kades: 'bg-purple-50 text-purple-700 ring-purple-600/20',
    menunggu_review_admin: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    selesai: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dibatalkan: 'bg-slate-50 text-slate-700 ring-slate-600/20',
    ditolak: 'bg-red-50 text-red-700 ring-red-600/20',
};

/**
 * Gender labels
 */
export const GENDER_LABELS = {
    L: 'Laki-laki',
    P: 'Perempuan',
};

/**
 * Religion options
 */
export const RELIGIONS = [
    'Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'
];

/**
 * Blood type options
 */
export const BLOOD_TYPES = ['A', 'B', 'AB', 'O', 'tidak_tahu'];

/**
 * Marital status labels
 */
export const MARITAL_STATUS = {
    belum_kawin: 'Belum Kawin',
    kawin: 'Kawin',
    cerai_hidup: 'Cerai Hidup',
    cerai_mati: 'Cerai Mati',
};

/**
 * Education levels
 */
export const EDUCATION_LEVELS = [
    'tidak_sekolah', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'
];

/**
 * Family relationship
 */
export const FAMILY_RELATIONS = {
    kepala: 'Kepala Keluarga',
    istri: 'Istri',
    anak: 'Anak',
    menantu: 'Menantu',
    cucu: 'Cucu',
    orang_tua: 'Orang Tua',
    mertua: 'Mertua',
    famili_lain: 'Famili Lain',
    lainnya: 'Lainnya',
};

/**
 * Mutation types
 */
export const MUTATION_TYPES = {
    lahir: 'Lahir',
    mati: 'Meninggal',
    pindah_keluar: 'Pindah Keluar',
    pindah_masuk: 'Pindah Masuk',
    datang: 'Datang',
};

/**
 * Resident status
 */
export const RESIDENT_STATUS = {
    aktif: 'Aktif',
    meninggal: 'Meninggal',
    pindah: 'Pindah',
    hilang: 'Hilang',
};

export const RESIDENT_STATUS_COLORS = {
    aktif: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    meninggal: 'bg-red-50 text-red-700 ring-red-600/20',
    pindah: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    hilang: 'bg-slate-50 text-slate-700 ring-slate-600/20',
};

/**
 * Role labels
 */
export const ROLE_LABELS = {
    kades: 'Kepala Desa',
    operator: 'Operator/Admin',
    rw: 'Ketua RW',
    rt: 'Ketua RT',
    sie_rukem: 'Sie. Rukun Kematian',
    kepala_kk: 'Kepala Keluarga',
    warga: 'Warga',
};

/**
 * Rukem membership status
 */
export const RUKEM_STATUS = {
    aktif: 'Aktif',
    nonaktif: 'Nonaktif',
    khusus: 'Khusus (Warga Kurang Mampu)',
    keluar: 'Keluar',
    tidak_ikut: 'Tidak Ikut',
};

export const RUKEM_STATUS_COLORS = {
    aktif: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    nonaktif: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    khusus: 'bg-purple-50 text-purple-700 ring-purple-600/20',
    keluar: 'bg-red-50 text-red-700 ring-red-600/20',
    tidak_ikut: 'bg-slate-50 text-slate-700 ring-slate-600/20',
};

/**
 * UMKM Sector types
 */
export const SEKTOR_USAHA = {
    kuliner: 'Kuliner',
    jasa: 'Jasa',
    perdagangan: 'Perdagangan',
    pertanian: 'Pertanian',
    kerajinan: 'Kerajinan',
    teknologi: 'Teknologi',
    lainnya: 'Lainnya',
};

export const SEKTOR_USAHA_COLORS = {
    kuliner: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    jasa: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    perdagangan: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    pertanian: 'bg-lime-50 text-lime-700 ring-lime-600/20',
    kerajinan: 'bg-purple-50 text-purple-700 ring-purple-600/20',
    teknologi: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20',
    lainnya: 'bg-slate-50 text-slate-700 ring-slate-600/20',
};

/**
 * UMKM Revenue range
 */
export const RENTANG_OMZET = {
    belum_ada: 'Belum Ada Omzet',
    '<1jt': '< Rp 1 Juta/bln',
    '1-5jt': 'Rp 1 - 5 Juta/bln',
    '5-15jt': 'Rp 5 - 15 Juta/bln',
    '15-50jt': 'Rp 15 - 50 Juta/bln',
    '>50jt': '> Rp 50 Juta/bln',
};

/**
 * UMKM Employee count
 */
export const JUMLAH_KARYAWAN = {
    '0': 'Tidak Ada',
    '1-4': '1 - 4 Orang',
    '5-19': '5 - 19 Orang',
    '20+': '20+ Orang',
};

/**
 * UMKM Status
 */
export const UMKM_STATUS = {
    aktif: 'Aktif',
    nonaktif: 'Nonaktif',
    tutup: 'Tutup',
};

export const UMKM_STATUS_COLORS = {
    aktif: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    nonaktif: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    tutup: 'bg-red-50 text-red-700 ring-red-600/20',
};
