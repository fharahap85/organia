<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use App\Models\PeriodeKepengurusan;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleAndUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Default Period
        $periode = PeriodeKepengurusan::create([
            'nama_periode' => 'Periode 2026 - 2029',
            'tanggal_mulai' => '2026-01-01',
            'tanggal_selesai' => '2029-12-31',
            'is_active' => true,
        ]);

        // 2. Create Roles
        $roles = [
            'Superadmin',
            'Ketua',
            'Sekretaris',
            'Bendahara',
            'Kaderisasi',
            'BIPEKA',
        ];

        $roleModels = [];
        foreach ($roles as $roleName) {
            $roleModels[$roleName] = Role::create(['name' => $roleName]);
        }

        // 3. Create Permissions
        $permissions = [
            'manage-users',
            'manage-period',
            'manage-agenda',
            'view-agenda',
            'manage-surat',
            'approve-surat',
            'manage-financial',
            'view-financial',
            'manage-kader',
            'view-kader',
        ];

        $permissionModels = [];
        foreach ($permissions as $permName) {
            $permissionModels[$permName] = Permission::create(['name' => $permName]);
        }

        // 4. Assign Permissions to Roles (Standard Matrix)
        // Superadmin gets everything (handled in User model hasPermission bypass, but let's seed it too)
        $roleModels['Superadmin']->permissions()->sync(array_values(array_map(fn($m) => $m->id, $permissionModels)));

        // Ketua
        $roleModels['Ketua']->permissions()->sync([
            $permissionModels['view-agenda']->id,
            $permissionModels['approve-surat']->id,
            $permissionModels['view-financial']->id,
            $permissionModels['view-kader']->id,
        ]);

        // Sekretaris
        $roleModels['Sekretaris']->permissions()->sync([
            $permissionModels['manage-agenda']->id,
            $permissionModels['view-agenda']->id,
            $permissionModels['manage-surat']->id,
        ]);

        // Bendahara
        $roleModels['Bendahara']->permissions()->sync([
            $permissionModels['manage-financial']->id,
            $permissionModels['view-financial']->id,
        ]);

        // Kaderisasi
        $roleModels['Kaderisasi']->permissions()->sync([
            $permissionModels['manage-kader']->id,
            $permissionModels['view-kader']->id,
        ]);

        // BIPEKA
        $roleModels['BIPEKA']->permissions()->sync([
            $permissionModels['manage-agenda']->id,
            $permissionModels['view-agenda']->id,
            $permissionModels['view-kader']->id,
        ]);

        // 5. Create default Superadmin User
        User::create([
            'name' => 'Superadmin Organia',
            'email' => 'superadmin@organia.local',
            'password' => Hash::make('password'),
            'role_id' => $roleModels['Superadmin']->id,
            'periode_id' => $periode->id,
            'status' => 'active',
        ]);
    }
}
