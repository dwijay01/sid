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

// RT/RW Controllers
use App\Http\Controllers\RtRw\RtRwDashboardController;
use App\Http\Controllers\RtRw\ApprovalController;
use App\Http\Controllers\RtRw\BypassInputController;

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

    // MymProfile routes
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
    });

    // -------------------------------------------------------------
    // RT / RW ROUTES
    // -------------------------------------------------------------
    Route::middleware(['role:rt_rw'])->prefix('rtrw')->name('rtrw.')->group(function () {
        Route::get('/dashboard', [RtRwDashboardController::class, 'index'])->name('dashboard');
        Route::get('/history', [RtRwDashboardController::class, 'history'])->name('history');
        Route::get('/my-residents', [RtRwDashboardController::class, 'residents'])->name('residents');
        
        Route::get('/approval/{letterRequest}', [ApprovalController::class, 'show'])->name('approval.show');
        Route::post('/approval/{letterRequest}/approve', [ApprovalController::class, 'approve'])->name('approval.approve');
        Route::post('/approval/{letterRequest}/reject', [ApprovalController::class, 'reject'])->name('approval.reject');
        
        Route::get('/bypass-input', [BypassInputController::class, 'create'])->name('bypass.create');
        Route::post('/bypass-input', [BypassInputController::class, 'store'])->name('bypass.store');
    });

    // -------------------------------------------------------------
    // WARGA ROUTES
    // -------------------------------------------------------------
    Route::middleware(['role:warga|kepala_kk'])->prefix('warga')->name('warga.')->group(function () {
        Route::get('/dashboard', [WargaDashboardController::class, 'index'])->name('dashboard');
        
        Route::get('/letters/create', [WargaLetterRequestController::class, 'create'])->name('letters.create');
        Route::post('/letters', [WargaLetterRequestController::class, 'store'])->name('letters.store');
        Route::get('/letters/{letterRequest}/track', [WargaLetterRequestController::class, 'track'])->name('letters.track');
        Route::get('/letters/{letterRequest}/download', [WargaLetterRequestController::class, 'downloadPdf'])->name('letters.download');
        Route::get('/history', [WargaLetterRequestController::class, 'history'])->name('history');
    });

});

require __DIR__.'/auth.php';
