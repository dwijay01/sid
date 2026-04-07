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
    belum: 'Belum Kawin',
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
    rt_rw: 'Ketua RT/RW',
    kepala_kk: 'Kepala Keluarga',
    warga: 'Warga',
};
