<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Role;
use App\Models\PeriodeKepengurusan;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private array $defaultRoleNames = ['Superadmin', 'Ketua', 'Sekretaris', 'Bendahara', 'Kaderisasi', 'BIPEKA'];

    private function seedRolesAndUser(): User
    {
        $periode = PeriodeKepengurusan::create([
            'nama_periode' => '2026-2029', 'tanggal_mulai' => '2026-01-01',
            'tanggal_selesai' => '2029-12-31', 'is_active' => true,
        ]);
        $role = Role::create(['name' => 'Superadmin']);
        return User::create([
            'name' => 'Admin', 'email' => 'admin@test.com',
            'password' => Hash::make('password'), 'role_id' => $role->id,
            'periode_id' => $periode->id, 'status' => 'active',
        ]);
    }

    public function test_login_returns_token_for_valid_credentials(): void
    {
        $this->seedRolesAndUser();

        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com', 'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['access_token', 'token_type', 'user']);
    }

    public function test_login_returns_422_for_wrong_password(): void
    {
        $this->seedRolesAndUser();

        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com', 'password' => 'wrong',
        ]);

        $response->assertStatus(422);
    }

    public function test_login_returns_422_for_nonexistent_email(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'nobody@test.com', 'password' => 'password',
        ]);

        $response->assertStatus(422);
    }

    public function test_login_rejects_inactive_user(): void
    {
        $role = Role::create(['name' => 'Superadmin']);
        $periode = PeriodeKepengurusan::create([
            'nama_periode' => '2026-2029', 'tanggal_mulai' => '2026-01-01',
            'tanggal_selesai' => '2029-12-31', 'is_active' => true,
        ]);
        User::create([
            'name' => 'Inactive', 'email' => 'inactive@test.com',
            'password' => Hash::make('password'), 'role_id' => $role->id,
            'periode_id' => $periode->id, 'status' => 'inactive',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'inactive@test.com', 'password' => 'password',
        ]);

        $response->assertStatus(422);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = $this->seedRolesAndUser();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/me');

        $response->assertOk()
            ->assertJsonPath('user.email', 'admin@test.com');
    }

    public function test_logout_deletes_token(): void
    {
        $user = $this->seedRolesAndUser();
        $token = $user->createToken('test')->plainTextToken;

        $this->assertDatabaseCount('personal_access_tokens', 1);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/logout');

        $response->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
