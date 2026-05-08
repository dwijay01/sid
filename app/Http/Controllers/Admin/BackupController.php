<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BackupController extends Controller
{
    public function index()
    {
        if (!Storage::exists('backups')) {
            Storage::makeDirectory('backups');
        }

        $files = Storage::files('backups');
        $backups = collect($files)->map(function ($file) {
            return [
                'name' => basename($file),
                'size' => $this->formatBytes(Storage::size($file)),
                'created_at' => date('Y-m-d H:i:s', Storage::lastModified($file)),
            ];
        })->sortByDesc('created_at')->values();

        return Inertia::render('Admin/Backup/Index', [
            'backups' => $backups
        ]);
    }

    public function create()
    {
        $filename = 'backup-' . date('Y-m-d-His') . '.sql';
        if (!Storage::exists('backups')) {
            Storage::makeDirectory('backups');
        }

        $path = Storage::path('backups/' . $filename);

        $dbConfig = config('database.connections.mysql');
        $port = $dbConfig['port'] ?? 3306;

        // Build mysqldump command with port and redirect stderr to capture errors
        $command = sprintf(
            'mysqldump --user=%s --password=%s --host=%s --port=%s --single-transaction --quick %s > %s 2>&1',
            escapeshellarg($dbConfig['username']),
            escapeshellarg($dbConfig['password']),
            escapeshellarg($dbConfig['host']),
            escapeshellarg($port),
            escapeshellarg($dbConfig['database']),
            escapeshellarg($path)
        );

        exec($command, $output, $returnVar);

        if ($returnVar !== 0) {
            $errorMsg = implode("\n", $output);
            \Log::error('Backup failed', ['return_var' => $returnVar, 'output' => $errorMsg]);

            // Clean up empty/failed file
            if (file_exists($path)) {
                unlink($path);
            }

            return back()->with('error', 'Gagal membuat backup database: ' . ($errorMsg ?: 'mysqldump tidak ditemukan atau tidak dapat diakses. Cek log server.'));
        }

        // Verify the file is not empty (mysqldump sometimes exits 0 but writes errors to the file)
        if (!file_exists($path) || filesize($path) < 100) {
            $content = file_exists($path) ? file_get_contents($path) : '';
            \Log::error('Backup file empty or too small', ['content' => substr($content, 0, 500)]);

            if (file_exists($path)) {
                unlink($path);
            }

            return back()->with('error', 'Backup file kosong atau corrupt. Cek koneksi database dan kredensial.');
        }

        $sizeFormatted = $this->formatBytes(filesize($path));

        return back()->with('success', "Backup database berhasil dibuat: {$filename} ({$sizeFormatted})");
    }

    public function download($filename)
    {
        $path = 'backups/' . $filename;
        if (!Storage::exists($path)) {
            return back()->with('error', 'File tidak ditemukan.');
        }

        return Storage::download($path);
    }

    public function destroy($filename)
    {
        $path = 'backups/' . $filename;
        if (Storage::exists($path)) {
            Storage::delete($path);
            return back()->with('success', 'File backup berhasil dihapus.');
        }

        return back()->with('error', 'File tidak ditemukan.');
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
