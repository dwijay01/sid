<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            // Master Data
            'view-residents',
            'create-residents',
            'edit-residents',
            'delete-residents',
            'view-family-cards',
            'create-family-cards',
            'edit-family-cards',
            'delete-family-cards',
            'view-wilayah',
            'manage-wilayah',
            'manage-mutations',

            // Rukun Kematian
            'view-rukem-data',
            'manage-rukem-data',

            // Persuratan
            'create-letter-request',
            'create-letter-request-for-others',
            'view-own-letter-requests',
            'view-wilayah-letter-requests',
            'view-all-letter-requests',
            'approve-letter-request',
            'process-letter-request',
            'print-letter',

            // Dashboard & Reports
            'view-dashboard-analytics',
            'export-reports',
            'view-audit-trail',

            // Settings & Management
            'manage-letter-types',
            'manage-letter-templates',
            'manage-village-settings',
            'manage-users',
            'manage-rt-users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Roles & Assign Permissions
        // Kepala Desa - full monitoring
        Role::firstOrCreate(['name' => 'kades'])->syncPermissions([
            'view-residents', 'view-family-cards', 'view-wilayah',
            'view-all-letter-requests',
            'view-dashboard-analytics', 'export-reports', 'view-audit-trail',
            'manage-village-settings', 'manage-users',
            'view-rukem-data',
        ]);

        // Operator Desa - full CRUD + letter processing
        Role::firstOrCreate(['name' => 'operator'])->syncPermissions([
            'view-residents', 'create-residents', 'edit-residents', 'delete-residents',
            'view-family-cards', 'create-family-cards', 'edit-family-cards', 'delete-family-cards',
            'view-wilayah', 'manage-wilayah',
            'manage-mutations',
            'create-letter-request', 'create-letter-request-for-others',
            'view-all-letter-requests',
            'process-letter-request', 'print-letter',
            'view-dashboard-analytics', 'export-reports',
            'manage-letter-types', 'manage-letter-templates',
            'manage-users',
            'view-rukem-data', 'manage-rukem-data',
        ]);

        // Ketua RW - view all data in RW, reports, manage RT access
        Role::firstOrCreate(['name' => 'rw'])->syncPermissions([
            'view-residents', 'view-family-cards', 'view-wilayah',
            'view-rukem-data',
            'export-reports',
            'manage-rt-users',
            'view-wilayah-letter-requests',
            'approve-letter-request',
        ]);

        // Ketua RT - input data scoped to their RT
        Role::firstOrCreate(['name' => 'rt'])->syncPermissions([
            'view-residents', 'create-residents', 'edit-residents',
            'view-family-cards',
            'manage-mutations',
            'manage-rukem-data', 'view-rukem-data',
            'create-letter-request', 'create-letter-request-for-others',
            'view-wilayah-letter-requests',
            'approve-letter-request',
        ]);

        // Sie Rukun Kematian - view rukem reports only
        Role::firstOrCreate(['name' => 'sie_rukem'])->syncPermissions([
            'view-rukem-data',
            'export-reports',
        ]);

        // Kepala Keluarga - family-level access
        Role::firstOrCreate(['name' => 'kepala_kk'])->syncPermissions([
            'create-letter-request',
            'view-own-letter-requests',
        ]);

        // Warga biasa - individual access
        Role::firstOrCreate(['name' => 'warga'])->syncPermissions([
            'create-letter-request',
            'view-own-letter-requests',
        ]);
    }
}
