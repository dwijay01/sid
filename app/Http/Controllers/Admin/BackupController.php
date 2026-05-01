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
        
        // Command construction
        // Use double quotes for paths and password to handle Windows spaces/special chars
        $command = sprintf(
            'mysqldump --user="%s" --password="%s" --host="%s" "%s" > "%s"',
            $dbConfig['username'],
            $dbConfig['password'],
            $dbConfig['host'],
            $dbConfig['database'],
            $path
        );

        exec($command, $output, $returnVar);

        if ($returnVar !== 0) {
            return back()->with('error', 'Gagal membuat backup database. Pastikan mysqldump terinstall dan dapat diakses.');
        }

        // Optional: Zip the file to save space
        // For now, keep it simple as .sql

        return back()->with('success', 'Backup database berhasil dibuat: ' . $filename);
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
