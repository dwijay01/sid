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
            set_time_limit(300);
            
            $filename = 'backup-' . date('Y-m-d-His') . '.sql';
            $relativeDir = 'backups';
            $relativeWeight = $relativeDir . '/' . $filename;

            Log::info('Backup starting', ['filename' => $filename]);

            if (!Storage::exists($relativeDir)) {
                Storage::makeDirectory($relativeDir);
            }

            // Get absolute path for mysqldump
            $path = Storage::path($relativeWeight);

            $connection = config('database.default', 'mysql');
            $dbConfig = config("database.connections.{$connection}");

            if (!$dbConfig) {
                throw new Exception("Database configuration for '{$connection}' not found.");
            }

            $host = $dbConfig['host'] ?? '127.0.0.1';
            $port = $dbConfig['port'] ?? 3306;
            $username = $dbConfig['username'] ?? '';
            $password = $dbConfig['password'] ?? '';
            $database = $dbConfig['database'] ?? '';

            if (empty($database)) {
                throw new Exception("Database name is not configured.");
            }

            // Using --user and --password format which is generally more robust
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
            
            Log::info('Mysqldump finished', ['return_var' => $returnVar]);

            if ($returnVar !== 0) {
                $errorMsg = substr(implode("\n", $output), 0, 1000); // Limit error message size
                Log::error('Backup command failed', ['output' => $errorMsg]);

                if (Storage::exists($relativeWeight)) {
                    Storage::delete($relativeWeight);
                }

                $safeError = str_replace($password, '******', $errorMsg);
                return back()->with('error', 'Gagal: ' . ($safeError ?: 'Perintah mysqldump gagal.'));
            }

            if (!Storage::exists($relativeWeight) || Storage::size($relativeWeight) < 100) {
                Log::error('Backup file missing or too small');
                if (Storage::exists($relativeWeight)) {
                    Storage::delete($relativeWeight);
                }
                return back()->with('error', 'File backup tidak valid atau kosong.');
            }

            $size = Storage::size($relativeWeight);
            $sizeFormatted = $this->formatBytes($size);

            Log::info('Backup success', ['filename' => $filename, 'size' => $sizeFormatted]);

            return back()->with('success', "Backup berhasil: {$filename} ({$sizeFormatted})");

        } catch (Exception $e) {
            Log::error('Backup exception: ' . $e->getMessage());
            return back()->with('error', 'Error sistem: ' . $e->getMessage());
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
        $value = $bytes / pow(1024, $pow);

        return round($value, $precision) . ' ' . $units[$pow];
    }
}
