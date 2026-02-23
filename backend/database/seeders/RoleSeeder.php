<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', config('seeder.email', 'himanshu@shipmymeds.com'))->firstOrFail();
        $companyId = (string) $user->company_id;

        $roles = [
            [
                'name' => 'Super Admin',
                'description' => 'Full access to all modules and settings.',
                'permissions' => [
                    'leads.view',
                    'leads.create',
                    'leads.edit',
                    'leads.delete',
                    'contacts.view',
                    'contacts.create',
                    'contacts.edit',
                    'deals.view',
                    'deals.create',
                    'deals.edit',
                    'analytics.view',
                    'roles.view',
                ],
            ],
            [
                'name' => 'Sales Manager',
                'description' => 'Manages leads, deals, contacts, and views analytics.',
                'permissions' => [
                    'leads.view',
                    'leads.create',
                    'leads.edit',
                    'deals.view',
                    'deals.create',
                    'deals.edit',
                    'contacts.view',
                    'contacts.create',
                    'analytics.view',
                ],
            ],
            [
                'name' => 'Sales Rep',
                'description' => 'Can create and view leads, contacts, and deals.',
                'permissions' => [
                    'leads.view',
                    'leads.create',
                    'contacts.view',
                    'contacts.create',
                    'deals.view',
                    'deals.create',
                ],
            ],
            [
                'name' => 'Analyst',
                'description' => 'Read-only access to leads, contacts, deals, and analytics.',
                'permissions' => ['leads.view', 'contacts.view', 'deals.view', 'analytics.view'],
            ],
        ];

        foreach ($roles as $data) {
            Role::firstOrCreate(
                ['company_id' => $companyId, 'name' => $data['name']],
                array_merge($data, ['company_id' => $companyId])
            );
        }

        $this->command->info('  Roles seeded: ' . count($roles));
    }
}
