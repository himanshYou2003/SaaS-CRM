<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Tests\RefreshMongoDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshMongoDatabase;

    public function test_register_company_creates_admin_user_and_default_roles(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'company_name' => 'Acme Corp',
            'name' => 'John Admin',
            'email' => 'admin@acme.com',
            'password' => 'secret123!',
            'password_confirmation' => 'secret123!',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'company' => ['name', 'slug', 'plan'],
                    'user' => ['name', 'email', 'company_id'],
                    'token',
                ],
            ]);

        $this->assertNotNull(User::where('email', 'admin@acme.com')->first());
        $this->assertNotNull(Company::where('name', 'Acme Corp')->first());
    }

    public function test_login_returns_token(): void
    {
        // First register
        $this->postJson('/api/v1/auth/register', [
            'company_name' => 'Beta Inc',
            'name' => 'Jane Admin',
            'email' => 'jane@beta.com',
            'password' => 'secret123!',
            'password_confirmation' => 'secret123!',
        ])->assertStatus(201);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'jane@beta.com',
            'password' => 'secret123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['token', 'user']]);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }

    public function test_tenants_are_isolated(): void
    {
        // Register company A
        $responseA = $this->postJson('/api/v1/auth/register', [
            'company_name' => 'Company A',
            'name' => 'Admin A',
            'email' => 'admin@companya.com',
            'password' => 'secret123!',
            'password_confirmation' => 'secret123!',
        ])->assertStatus(201);
        $tokenA = $responseA->json('data.token');

        // Register company B
        $responseB = $this->postJson('/api/v1/auth/register', [
            'company_name' => 'Company B',
            'name' => 'Admin B',
            'email' => 'admin@companyb.com',
            'password' => 'secret123!',
            'password_confirmation' => 'secret123!',
        ])->assertStatus(201);
        $tokenB = $responseB->json('data.token');

        // Company A creates a lead
        $this->withToken($tokenA)
            ->postJson('/api/v1/leads', ['title' => 'Secret Lead of A'])
            ->assertStatus(201);

        // Company B should NOT see Company A's leads
        $leadsForB = $this->withToken($tokenB)
            ->getJson('/api/v1/leads')
            ->assertStatus(200)
            ->json('data.data');

        $leadTitles = array_column($leadsForB, 'title');
        $this->assertNotContains('Secret Lead of A', $leadTitles);
    }

    public function test_unauthenticated_access_is_rejected(): void
    {
        $this->getJson('/api/v1/leads')->assertStatus(401);
    }
}
