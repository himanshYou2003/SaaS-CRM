<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LeadTest extends TestCase
{
    use RefreshDatabase;

    private string $token;
    private array $company;

    protected function setUp(): void
    {
        parent::setUp();

        $response = $this->postJson('/api/v1/auth/register', [
            'company_name' => 'Test Corp',
            'name' => 'Test Admin',
            'email' => 'admin@testcorp.com',
            'password' => 'secret123!',
            'password_confirmation' => 'secret123!',
        ]);

        $this->token = $response->json('data.token');
        $this->company = $response->json('data.company');
    }

    public function test_create_lead(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/leads', [
                'title' => 'New Opportunity',
                'status' => 'new',
                'value' => 5000,
                'tags' => ['enterprise', 'priority'],
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'New Opportunity')
            ->assertJsonPath('data.status', 'new');
    }

    public function test_list_leads(): void
    {
        $this->withToken($this->token)->postJson('/api/v1/leads', ['title' => 'Lead 1']);
        $this->withToken($this->token)->postJson('/api/v1/leads', ['title' => 'Lead 2']);

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/leads')
            ->assertStatus(200)
            ->assertJsonStructure(['data' => ['data']]);

        $this->assertCount(2, $response->json('data.data'));
    }

    public function test_update_lead_status(): void
    {
        $lead = $this->withToken($this->token)
            ->postJson('/api/v1/leads', ['title' => 'Status Test'])
            ->json('data');

        $this->withToken($this->token)
            ->postJson("/api/v1/leads/{$lead['_id']}/status", ['status' => 'qualified'])
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'qualified');
    }

    public function test_delete_lead(): void
    {
        $lead = $this->withToken($this->token)
            ->postJson('/api/v1/leads', ['title' => 'To Delete'])
            ->json('data');

        $this->withToken($this->token)
            ->deleteJson("/api/v1/leads/{$lead['_id']}")
            ->assertStatus(204);
    }
}
