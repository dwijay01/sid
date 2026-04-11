<?php

namespace App\Http\Controllers;

use App\Models\ImportLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ImportLogController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = ImportLog::with('user.roles')
            ->orderBy('created_at', 'desc');

        // Scoping: RT only sees their own logs, RW/Admin can see all (or scope as needed)
        if ($user->hasRole('rt')) {
            $query->where('user_id', $user->id);
        }

        $logs = $query->paginate(10);

        return Inertia::render('ImportLogs/Index', [
            'logs' => $logs,
        ]);
    }

    public function show(ImportLog $importLog)
    {
        $user = auth()->user();
        
        // Basic security check
        if ($user->hasRole('rt') && $importLog->user_id !== $user->id) {
            abort(403);
        }

        return response()->json($importLog);
    }
}
