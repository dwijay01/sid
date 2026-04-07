<?php

namespace App\Services;

use App\Models\AuditTrail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditService
{
    /**
     * Record an audit trail entry.
     */
    public static function log(
        Model $model,
        string $event,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?int $userId = null
    ): AuditTrail {
        return AuditTrail::create([
            'auditable_type' => get_class($model),
            'auditable_id' => $model->getKey(),
            'event' => $event,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'user_id' => $userId ?? Auth::id(),
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    /**
     * Log a 'created' event.
     */
    public static function logCreated(Model $model, ?int $userId = null): AuditTrail
    {
        return static::log($model, 'created', null, $model->toArray(), $userId);
    }

    /**
     * Log an 'updated' event.
     */
    public static function logUpdated(Model $model, array $oldValues, ?int $userId = null): AuditTrail
    {
        $changedKeys = array_keys($model->getChanges());
        $newValues = array_intersect_key($model->toArray(), array_flip($changedKeys));
        $filteredOld = array_intersect_key($oldValues, array_flip($changedKeys));

        return static::log($model, 'updated', $filteredOld, $newValues, $userId);
    }

    /**
     * Log a 'deleted' event.
     */
    public static function logDeleted(Model $model, ?int $userId = null): AuditTrail
    {
        return static::log($model, 'deleted', $model->toArray(), null, $userId);
    }
}
