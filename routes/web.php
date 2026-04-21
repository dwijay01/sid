<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LandingPageController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Admin Controllers
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ResidentController;
use App\Http\Controllers\Admin\FamilyCardController;
use App\Http\Controllers\Admin\WilayahController;
use App\Http\Controllers\Admin\MutationController;
use App\Http\Controllers\Admin\LetterRequestController as AdminLetterRequestController;
use App\Http\Controllers\Admin\LetterTemplateController;
use App\Http\Controllers\Admin\LetterTypeController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;

// Kades Controllers
use App\Http\Controllers\Kades\DashboardController as KadesDashboardController;
use App\Http\Controllers\Kades\ReportController as KadesReportController;

// RW Controllers
use App\Http\Controllers\Rw\RwDashboardController;
use App\Http\Controllers\Rw\RtUserController;

// RT Controllers
use App\Http\Controllers\Rt\RtDashboardController;
use App\Http\Controllers\Rt\RtResidentController;
use App\Http\Controllers\Rt\RtMutationController;
use App\Http\Controllers\Rt\RtRukemController;
use App\Http\Controllers\Rt\RtLetterController;
use App\Http\Controllers\Rt\RtFamilyCardController;
use App\Http\Controllers\Rt\RtUmkmController;

// Sie Rukem Controllers
use App\Http\Controllers\SieRukem\SieRukemDashboardController;

// Sie Pemberdayaan Controllers
use App\Http\Controllers\SiePemberdayaan\DashboardController as SiePemberdayaanDashboardController;
use App\Http\Controllers\SiePemberdayaan\InternetController;
use App\Http\Controllers\SiePemberdayaan\SkillController;
use App\Http\Controllers\SiePemberdayaan\BansosController;
use App\Http\Controllers\SiePemberdayaan\WasteController;

// Warga Controllers
use App\Http\Controllers\Warga\DashboardController as WargaDashboardController;
use App\Http\Controllers\Warga\LetterRequestController as WargaLetterRequestController;

// Public QR Verification
Route::get('/verify/{token}', [\App\Http\Controllers\QrVerificationController::class, 'verify'])->name('qr.verify');

// Landing Page
Route::get('/', [LandingPageController::class, 'index'])->name('landing');

Route::middleware('auth')->group(function () {
    
    // Universal Dashboard Redirector
    Route::get('/dashboard', function () {
        return redirect()->route(auth()->user()->getDashboardRoute());
    })->name('dashboard');

    // My Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // -------------------------------------------------------------
    // KADES ROUTES
    // -------------------------------------------------------------
    Route::middleware(['role:kades'])->prefix('kades')->name('kades.')->group(function () {
        Route::get('/dashboard', [KadesDashboardController::class, 'index'])->name('dashboard');
        
        // Letter Approval
        Route::get('/letters/{letterRequest}', [KadesDashboardController::class, 'showLetter'])->name('letters.show');
        Route::post('/letters/{letterRequest}/approve', [KadesDashboardController::class, 'approveLetter'])->name('letters.approve');
        Route::post('/letters/{letterRequest}/reject', [KadesDashboardController::class, 'rejectLetter'])->name('letters.reject');

        Route::get('/reports/demography', [KadesReportController::class, 'demography'])->name('reports.demography');
        Route::get('/reports/letters', [KadesReportController::class, 'letters'])->name('reports.letters');
        Route::get('/reports/audit', [KadesReportController::class, 'audit'])->name('reports.audit');
    });

    // -------------------------------------------------------------
    // ADMIN / OPERATOR ROUTES
    // -------------------------------------------------------------
    Route::middleware(['role:operator'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        // Master Data
        // Export Residents
        Route::get('/residents/export', [ResidentController::class, 'export'])->name('residents.export');
        Route::post('/residents/import', [ResidentController::class, 'import'])->name('residents.import');
        
        Route::resource('residents', ResidentController::class);
        Route::resource('family-cards', FamilyCardController::class);
        Route::resource('wilayah', WilayahController::class)->except(['show']);
        Route::get('mutations/create-birth', [MutationController::class, 'createBirth'])->name('mutations.createBirth');
        Route::post('mutations/birth', [MutationController::class, 'storeBirth'])->name('mutations.storeBirth');
        Route::get('mutations/create-death', [MutationController::class, 'createDeath'])->name('mutations.createDeath');
        Route::post('mutations/death', [MutationController::class, 'storeDeath'])->name('mutations.storeDeath');
        Route::get('mutations/{mutation}/print', [MutationController::class, 'print'])->name('mutations.print');
        Route::resource('mutations', MutationController::class)->except(['show', 'edit', 'update']);
        
        // Letters
        Route::get('/letters/queue', [AdminLetterRequestController::class, 'queue'])->name('letters.queue');
        Route::get('/letters/history', [AdminLetterRequestController::class, 'history'])->name('letters.history');
        Route::get('/letters/walk-in', [AdminLetterRequestController::class, 'walkIn'])->name('letters.walkin');
        Route::post('/letters/walk-in', [AdminLetterRequestController::class, 'storeWalkIn'])->name('letters.storeWalkIn');
        Route::get('/letters/{letterRequest}', [AdminLetterRequestController::class, 'show'])->name('letters.show');
        Route::post('/letters/{letterRequest}/process', [AdminLetterRequestController::class, 'process'])->name('letters.process');
        Route::get('/letters/{letterRequest}/print', [AdminLetterRequestController::class, 'print'])->name('letters.print');
        
        // Settings & Masters
        Route::resource('letter-templates', LetterTemplateController::class);
        Route::resource('letter-types', LetterTypeController::class)->except(['show']);
        Route::resource('users', UserManagementController::class);
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
        Route::post('/settings/upload', [SettingController::class, 'uploadFile'])->name('settings.upload');

        // Reports
        Route::get('/reports/demography', [AdminReportController::class, 'demography'])->name('reports.demography');
        Route::get('/reports/letters', [AdminReportController::class, 'letters'])->name('reports.letters');

        // Import Logs
        Route::get('/import-logs', [\App\Http\Controllers\ImportLogController::class, 'index'])->name('import-logs.index');
        Route::get('/import-logs/{importLog}', [\App\Http\Controllers\ImportLogController::class, 'show'])->name('import-logs.show');
    });

    // -------------------------------------------------------------
    // RW ROUTES (KETUA RW)
    // -------------------------------------------------------------
    Route::middleware(['role:rw'])->prefix('rw')->name('rw.')->group(function () {
        Route::get('/dashboard', [RwDashboardController::class, 'index'])->name('dashboard');
        Route::get('/residents', [RwDashboardController::class, 'residents'])->name('residents');
        Route::get('/family-cards', [RwDashboardController::class, 'familyCards'])->name('family-cards');
        Route::get('/rukem', [RwDashboardController::class, 'rukemMembers'])->name('rukem');
        Route::get('/umkm', [RwDashboardController::class, 'umkm'])->name('umkm');
        Route::get('/reports', [RwDashboardController::class, 'reports'])->name('reports');
        Route::get('/letters', [RwDashboardController::class, 'letters'])->name('letters');

        // Manage RT Users
        Route::get('/rt-users', [RtUserController::class, 'index'])->name('rt-users.index');
        Route::post('/rt-users', [RtUserController::class, 'store'])->name('rt-users.store');
        Route::post('/rt-users/{user}/toggle', [RtUserController::class, 'toggleActive'])->name('rt-users.toggle');
        Route::post('/rt-users/{user}/approve', [RtUserController::class, 'approve'])->name('rt-users.approve');
        Route::post('/rt-users/{user}/reject', [RtUserController::class, 'reject'])->name('rt-users.reject');

        // Pengaduan Warga
        Route::get('/pengaduan', [\App\Http\Controllers\Rw\ComplaintController::class, 'index'])->name('complaints.index');
        Route::get('/pengaduan/{complaint}', [\App\Http\Controllers\Rw\ComplaintController::class, 'show'])->name('complaints.show');
        Route::post('/pengaduan/{complaint}/status', [\App\Http\Controllers\Rw\ComplaintController::class, 'updateStatus'])->name('complaints.updateStatus');
    });

    // -------------------------------------------------------------
    // RT ROUTES (KETUA RT)
    // -------------------------------------------------------------
    Route::middleware(['role:rt'])->prefix('rt')->name('rt.')->group(function () {
        Route::get('/dashboard', [RtDashboardController::class, 'index'])->name('dashboard');
        Route::get('/residents', [RtDashboardController::class, 'residents'])->name('residents');
        Route::get('/reports', [RtDashboardController::class, 'reports'])->name('reports');
        
        // Family Cards
        Route::post('/family-cards/quick-store', [RtFamilyCardController::class, 'quickStore'])->name('family-cards.quick-store');
        Route::resource('family-cards', RtFamilyCardController::class)->except(['show']);

        // Resident CRUD
        Route::get('/residents/create', [RtResidentController::class, 'create'])->name('residents.create');
        Route::post('/residents', [RtResidentController::class, 'store'])->name('residents.store');
        Route::get('/residents/{resident}/edit', [RtResidentController::class, 'edit'])->name('residents.edit');
        Route::put('/residents/{resident}', [RtResidentController::class, 'update'])->name('residents.update');
        Route::post('/residents/import', [RtResidentController::class, 'import'])->name('residents.import');

        // Mutations
        Route::get('/mutations', [RtMutationController::class, 'index'])->name('mutations.index');
        Route::get('/mutations/move-out', [RtMutationController::class, 'createMoveOut'])->name('mutations.move-out');
        Route::post('/mutations/move-out', [RtMutationController::class, 'storeMoveOut'])->name('mutations.store-move-out');
        Route::get('/mutations/move-in', [RtMutationController::class, 'createMoveIn'])->name('mutations.move-in');
        Route::post('/mutations/move-in', [RtMutationController::class, 'storeMoveIn'])->name('mutations.store-move-in');
        Route::get('/mutations/death', [RtMutationController::class, 'createDeath'])->name('mutations.death');
        Route::post('/mutations/death', [RtMutationController::class, 'storeDeath'])->name('mutations.store-death');
        Route::get('/mutations/birth', [RtMutationController::class, 'createBirth'])->name('mutations.birth');
        Route::post('/mutations/birth', [RtMutationController::class, 'storeBirth'])->name('mutations.store-birth');

        // Rukun Kematian
        Route::get('/rukem', [RtRukemController::class, 'index'])->name('rukem.index');
        Route::get('/rukem/create', [RtRukemController::class, 'create'])->name('rukem.create');
        Route::post('/rukem', [RtRukemController::class, 'store'])->name('rukem.store');
        Route::get('/rukem/{rukem}/edit', [RtRukemController::class, 'edit'])->name('rukem.edit');
        Route::put('/rukem/{rukem}', [RtRukemController::class, 'update'])->name('rukem.update');

        // UMKM
        Route::resource('umkm', RtUmkmController::class);

        // Letters (approval)
        Route::get('/letters', [RtLetterController::class, 'index'])->name('letters.index');
        Route::get('/letters/{letterRequest}', [RtLetterController::class, 'show'])->name('letters.show');
        Route::get('/letters/{letterRequest}/approve', [RtLetterController::class, 'approve'])->name('letters.approve');
        Route::post('/letters/{letterRequest}/reject', [RtLetterController::class, 'reject'])->name('letters.reject');
        // Import Logs
        Route::get('/import-logs', [\App\Http\Controllers\ImportLogController::class, 'index'])->name('import-logs.index');
        Route::get('/import-logs/{importLog}', [\App\Http\Controllers\ImportLogController::class, 'show'])->name('import-logs.show');

        // Pengaduan Warga
        Route::get('/pengaduan', [\App\Http\Controllers\Rt\ComplaintController::class, 'index'])->name('complaints.index');
        Route::get('/pengaduan/{complaint}', [\App\Http\Controllers\Rt\ComplaintController::class, 'show'])->name('complaints.show');
        Route::post('/pengaduan/{complaint}/status', [\App\Http\Controllers\Rt\ComplaintController::class, 'updateStatus'])->name('complaints.updateStatus');
    });

    // -------------------------------------------------------------
    // SIE RUKEM ROUTES
    // -------------------------------------------------------------
    Route::middleware(['role:sie_rukem'])->prefix('sie-rukem')->name('sie-rukem.')->group(function () {
        Route::get('/dashboard', [SieRukemDashboardController::class, 'index'])->name('dashboard');
        Route::get('/members', [SieRukemDashboardController::class, 'members'])->name('members');
    });

    // -------------------------------------------------------------
    // SIE PEMBERDAYAAN ROUTES
    // -------------------------------------------------------------
    Route::middleware(['role:sie_pemberdayaan'])->prefix('sie-pemberdayaan')->name('sie-pemberdayaan.')->group(function () {
        Route::get('/dashboard', [SiePemberdayaanDashboardController::class, 'index'])->name('dashboard');
        
        // Internet management
        Route::get('/internet', [InternetController::class, 'index'])->name('internet.index');
        Route::get('/internet/create', [InternetController::class, 'create'])->name('internet.create');
        Route::post('/internet', [InternetController::class, 'store'])->name('internet.store');
        Route::get('/internet/{internetSubscription}/edit', [InternetController::class, 'edit'])->name('internet.edit');
        Route::put('/internet/{internetSubscription}', [InternetController::class, 'update'])->name('internet.update');
        Route::get('/internet/{internetSubscription}/payments', [InternetController::class, 'payments'])->name('internet.payments');
        Route::post('/internet/{internetSubscription}/toggle-payment', [InternetController::class, 'togglePayment'])->name('internet.toggle-payment');

        // Skills database
        Route::resource('skills', SkillController::class);

        // Bansos recommendations
        Route::get('/bansos', [BansosController::class, 'index'])->name('bansos.index');

        // Waste management
        Route::resource('waste', WasteController::class);
    });

    // -------------------------------------------------------------
    // WARGA ROUTES
    // -------------------------------------------------------------
    Route::middleware(['role:warga|kepala_kk'])->prefix('warga')->name('warga.')->group(function () {
        Route::get('/dashboard', [WargaDashboardController::class, 'index'])->name('dashboard');
        
        // Surat Routes
        Route::get('/letters/create', [WargaLetterRequestController::class, 'create'])->name('letters.create');
        Route::post('/letters', [WargaLetterRequestController::class, 'store'])->name('letters.store');
        Route::get('/letters/{letterRequest}/track', [WargaLetterRequestController::class, 'track'])->name('letters.track');
        Route::get('/letters/{letterRequest}/download', [WargaLetterRequestController::class, 'downloadPdf'])->name('letters.download');
        Route::get('/history', [WargaLetterRequestController::class, 'history'])->name('history');
        
        // Keluarga Routes
        Route::get('/keluarga', [\App\Http\Controllers\Warga\FamilyController::class, 'index'])->name('keluarga');

        // Pengaduan Routes
        Route::get('/pengaduan', [\App\Http\Controllers\Warga\ComplaintController::class, 'index'])->name('complaints.index');
        Route::get('/pengaduan/create', [\App\Http\Controllers\Warga\ComplaintController::class, 'create'])->name('complaints.create');
        Route::post('/pengaduan', [\App\Http\Controllers\Warga\ComplaintController::class, 'store'])->name('complaints.store');
        Route::get('/pengaduan/{complaint}', [\App\Http\Controllers\Warga\ComplaintController::class, 'show'])->name('complaints.show');
    });

});

require __DIR__.'/auth.php';
