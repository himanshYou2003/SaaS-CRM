<?php

namespace Tests;

use Illuminate\Support\Facades\DB;

/**
 * Drop and recreate all MongoDB collections before each test so every
 * test starts from a clean slate. Replaces the SQL-only RefreshDatabase trait.
 */
trait RefreshMongoDatabase
{
    protected function setUpRefreshMongoDatabase(): void
    {
        $this->dropMongoCollections();
    }

    private function dropMongoCollections(): void
    {
        try {
            $collections = [
                'companies',
                'users',
                'roles',
                'subscriptions',
                'leads',
                'contacts',
                'deals',
                'personal_access_tokens',
            ];

            $db = DB::connection('mongodb')->getMongoDB();

            foreach ($collections as $collection) {
                // Using truncate() is generally more robust than dropCollection() during parallel tests
                DB::connection('mongodb')->table($collection)->truncate();
            }
        } catch (\Exception $e) {
            // Log the error but don't fail the setup if the connection is temporarily down or collection missing
            \Illuminate\Support\Facades\Log::error("RefreshMongoDatabase failed: " . $e->getMessage());
        }
    }
}
