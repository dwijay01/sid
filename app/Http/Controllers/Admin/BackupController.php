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
        try {
            if (!Storage::exists('backups')) {
                Storage::makeDirectory('backups');
            }

            $files = Storage::files('backups');
            
            $backups = collect($files)->map(function ($file) {
                try {
                    if (!Storage::exists($file)) return null;
                    
                    $size = Storage::size($file);
                    $lastModified = Storage::lastModified($file);
                    
                    return [
                        'name' => basename($file),
                        'size' => $this->formatBytes($size),
                        'created_at' => $lastModified ? date('Y-m-d H:i:s', $lastModified) : 'N/A',
                    ];
                } catch (Exception $e) {
                    Log::warning('Failed to process backup file: ' . $file, ['error' => $e->getMessage()]);
                    return null;
                }
            })->filter()->sortByDesc('created_at')->values();

            return Inertia::render('Admin/Backup/Index', [
                'backups' => $backups
            ]);
        } catch (Exception $e) {
            Log::error('Backup Index Error: ' . $e->getMessage());
            return redirect()->route('admin.dashboard')->with('error', 'Gagal memuat halaman backup: ' . $e->getMessage());
        }
    }

    public function create()
    {
        try {
            set_time_limit(300);
            
            $filename = 'backup-' . date('Y-m-d-His') . '.sql';
            $relativeDir = 'backups';
            $relativePath = $relativeDir . '/' . $filename;

            if (!Storage::exists($relativeDir)) {
                Storage::makeDirectory($relativeDir);
            }

            $path = Storage::path($relativePath);

            $connection = config('database.default', 'mysql');
            $dbConfig = config("database.connections.{$connection}");

            if (!$dbConfig) {
                return redirect()->route('admin.backup.index')->with('error', 'Konfigurasi database tidak ditemukan.');
            }

            $host = $dbConfig['host'] ?? '127.0.0.1';
            $port = $dbConfig['port'] ?? 3306;
            $username = $dbConfig['username'] ?? '';
            $password = $dbConfig['password'] ?? '';
            $database = $dbConfig['database'] ?? '';

            if (empty($database)) {
                return redirect()->route('admin.backup.index')->with('error', 'Nama database tidak dikonfigurasi.');
            }

            // Using standard mysqldump command
            $command = sprintf(
                'mysqldump --user=%s --password=%s --host=%s --port=%s --single-transaction --quick %s > %s 2>&1',
                escapeshellarg($username),
                escapeshellarg($password),
                escapeshellarg($host),
                escapeshellarg($port),
                escapeshellarg($database),
                escapeshellarg($path)
            );

            exec($command, $output, $returnVar);

            if ($returnVar !== 0) {
                if (Storage::exists($relativePath)) {
                    Storage::delete($relativePath);
                }
                $errorMsg = substr(implode("\n", $output), 0, 500);
                $safeError = str_replace($password, '******', $errorMsg);
                return redirect()->route('admin.backup.index')->with('error', 'Gagal: ' . ($safeError ?: 'Perintah mysqldump gagal.'));
            }

            if (!Storage::exists($relativePath) || Storage::size($relativePath) < 10) {
                if (Storage::exists($relativePath)) {
                    Storage::delete($relativePath);
                }
                return redirect()->route('admin.backup.index')->with('error', 'File backup tidak terbentuk dengan benar.');
            }

            $size = Storage::size($relativePath);
            $sizeFormatted = $this->formatBytes($size);

            return redirect()->route('admin.backup.index')->with('success', "Backup berhasil: {$filename} ({$sizeFormatted})");

        } catch (Exception $e) {
            Log::error('Backup Error: ' . $e->getMessage());
            return redirect()->route('admin.backup.index')->with('error', 'Kesalahan sistem: ' . $e->getMessage());
        }
    }

    public function download($filename)
    {
        try {
            $path = 'backups/' . $filename;
            if (!Storage::exists($path)) {
                return redirect()->route('admin.backup.index')->with('error', 'File tidak ditemukan.');
            }
            return Storage::download($path);
        } catch (Exception $e) {
            return redirect()->route('admin.backup.index')->with('error', 'Gagal mengunduh: ' . $e->getMessage());
        }
    }

    public function destroy($filename)
    {
        try {
            $path = 'backups/' . $filename;
            if (Storage::exists($path)) {
                Storage::delete($path);
                return redirect()->route('admin.backup.index')->with('success', 'Backup berhasil dihapus.');
            }
            return redirect()->route('admin.backup.index')->with('error', 'File tidak ditemukan.');
        } catch (Exception $e) {
            return redirect()->route('admin.backup.index')->with('error', 'Gagal menghapus: ' . $e->getMessage());
        }
    }

    private function formatBytes($bytes, $precision = 2)
    {
        if ($bytes <= 0) return '0 B';
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $pow = floor(log($bytes, 1024));
        $pow = min($pow, count($units) - 1);
        $value = $bytes / pow(1024, $pow);

        return round($value, $precision) . ' ' . $units[$pow];
    }
}
