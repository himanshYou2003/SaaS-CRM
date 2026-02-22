<?php

namespace App\Services;

use App\Models\Company;
use App\Models\User;
use App\Models\Role;
use App\Models\Subscription;
use App\DTO\RegisterDTO;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\NewAccessToken;

class AuthService
{
    /**
     * Register a new company with its admin user and default roles.
     */
    public function registerCompany(RegisterDTO $dto): array
    {
        // 1. Create the company
        $company = Company::create([
            'name' => $dto->companyName,
            'slug' => Str::slug($dto->companyName) . '-' . Str::random(4),
            'email' => $dto->email,
            'plan' => 'starter',
            'is_active' => true,
        ]);

        // 2. Create default roles for this tenant
        $adminRole = $this->createDefaultRoles($company->_id);

        // 3. Create subscription (starter trial)
        Subscription::create([
            'company_id' => $company->_id,
            'plan' => 'starter',
            'status' => 'trial',
            'seats' => 5,
            'price_per_month' => 0,
            'started_at' => now(),
            'expires_at' => now()->addDays(14),
        ]);

        // 4. Create admin user
        $user = User::create([
            'company_id' => $company->_id,
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
            'role_id' => $adminRole->_id,
            'permissions' => ['*'],    // admin wildcard
            'is_active' => true,
        ]);

        // 5. Issue token
        $token = $user->createToken('api-token');

        return [
            'company' => $company,
            'user' => $user->makeHidden(['password']),
            'token' => $token->plainTextToken,
        ];
    }

    /**
     * Authenticate user and return token.
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw new \Illuminate\Validation\ValidationException(
                validator([], []),
                response()->json(['message' => 'Invalid credentials.'], 401)
            );
        }

        if (!$user->is_active) {
            throw new \Exception('Your account has been deactivated.', 403);
        }

        // Revoke previous tokens to enforce single session (optional: remove for multi-device)
        // $user->tokens()->delete();

        $token = $user->createToken('api-token');

        return [
            'user' => $user->load('role')->makeHidden(['password']),
            'token' => $token->plainTextToken,
        ];
    }

    /**
     * Revoke current token.
     */
    public function logout(\App\Models\User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    /**
     * Create default roles (admin, manager, sales_rep, viewer) for a new company.
     */
    private function createDefaultRoles(string $companyId): Role
    {
        $roles = [
            [
                'company_id' => $companyId,
                'name' => 'admin',
                'description' => 'Full access to all modules',
                'permissions' => ['*'],
            ],
            [
                'company_id' => $companyId,
                'name' => 'manager',
                'description' => 'Manage team and view analytics',
                'permissions' => [
                    'view_leads',
                    'create_lead',
                    'edit_lead',
                    'assign_lead',
                    'view_deals',
                    'create_deal',
                    'edit_deal',
                    'update_deal_stage',
                    'view_contacts',
                    'create_contact',
                    'edit_contact',
                    'view_analytics',
                ],
            ],
            [
                'company_id' => $companyId,
                'name' => 'sales_rep',
                'description' => 'Create and manage own leads/deals',
                'permissions' => [
                    'view_leads',
                    'create_lead',
                    'edit_lead',
                    'view_deals',
                    'create_deal',
                    'edit_deal',
                    'update_deal_stage',
                    'view_contacts',
                    'create_contact',
                    'edit_contact',
                ],
            ],
            [
                'company_id' => $companyId,
                'name' => 'viewer',
                'description' => 'Read-only access',
                'permissions' => ['view_leads', 'view_deals', 'view_contacts', 'view_analytics'],
            ],
        ];

        $adminRole = null;
        foreach ($roles as $roleData) {
            $role = Role::create($roleData);
            if ($roleData['name'] === 'admin') {
                $adminRole = $role;
            }
        }

        return $adminRole;
    }
}
