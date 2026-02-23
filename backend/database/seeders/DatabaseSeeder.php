<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the CRM database.
     *
     * Finds the first user (or a specific email) and seeds all related data
     * under their company. Safe to re-run — all seeded records are soft-tagged.
     *
     * Usage:
     *   php artisan db:seed
     *   php artisan db:seed --class=LeadSeeder
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            ContactSeeder::class,
            LeadSeeder::class,
            DealSeeder::class,
        ]);
    }
}
