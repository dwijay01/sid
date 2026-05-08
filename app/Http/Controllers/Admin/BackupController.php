<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Exception;

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
        try {
            $filename = 'backup-' . date('Y-m-d-His') . '.sql';
            if (!Storage::exists('backups')) {
                Storage::makeDirectory('backups');
            }

            $path = Storage::path('backups/' . $filename);

            $connection = config('database.default', 'mysql');
            $dbConfig = config("database.connections.{$connection}");

            if (!$dbConfig) {
                throw new Exception("Konfigurasi database untuk koneksi '{$connection}' tidak ditemukan.");
            }

            $port = $dbConfig['port'] ?? 3306;
            $username = $dbConfig['username'] ?? '';
            $password = $dbConfig['password'] ?? '';
            $host = $dbConfig['host'] ?? '127.0.0.1';
            $database = $dbConfig['database'] ?? '';

            if (empty($database)) {
                throw new Exception("Nama database belum dikonfigurasi.");
            }

            // Build mysqldump command with port and redirect stderr to capture errors
            // Note: Using short flags for compatibility and reliability
            $command = sprintf(
                'mysqldump -h %s -P %s -u %s -p%s --single-transaction --quick %s > %s 2>&1',
                escapeshellarg($host),
                escapeshellarg($port),
                escapeshellarg($username),
                escapeshellarg($password), // In -p%s there's no space between -p and the password
                escapeshellarg($database),
                escapeshellarg($path)
            );

            // Special handling for the password: if it has spaces or special chars, 
            // some shells might struggle with -p'pass'. 
            // Let's try the more standard --password version if it fails, but for now stick to one.
            
            exec($command, $output, $returnVar);

            if ($returnVar !== 0) {
                $errorMsg = implode("\n", $output);
                Log::error('Backup failed', ['return_var' => $returnVar, 'output' => $errorMsg]);

                // Clean up empty/failed file
                if (file_exists($path)) {
                    unlink($path);
                }

                // Mask password in error message if it appears
                $safeErrorMsg = str_replace($password, '******', $errorMsg);
                return back()->with('error', 'Gagal membuat backup database: ' . ($safeErrorMsg ?: 'mysqldump tidak ditemukan atau tidak dapat diakses.'));
            }

            // Verify the file is not empty (mysqldump sometimes exits 0 but writes errors to the file)
            if (!file_exists($path) || filesize($path) < 100) {
                $content = file_exists($path) ? file_get_contents($path) : '';
                Log::error('Backup file empty or too small', ['content' => substr($content, 0, 500)]);

                if (file_exists($path)) {
                    unlink($path);
                }

                return back()->with('error', 'Backup file kosong atau corrupt. Pastikan mysqldump tersedia di server.');
            }

            $sizeFormatted = $this->formatBytes(filesize($path));

            return back()->with('success', "Backup database berhasil dibuat: {$filename} ({$sizeFormatted})");
        } catch (Exception $e) {
            Log::error('Backup exception', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return back()->with('error', 'Terjadi kesalahan sistem saat memproses backup: ' . $e->getMessage());
        }
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
