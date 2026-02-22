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
        $collections = [
            'companies',
            'users',
            'roles',
            'subscriptions',
            'leads',
            'contacts',
            'deals',
            // 'personal_access_tokens',
        ];

        $db = DB::connection('mongodb')->getMongoDB();

        foreach ($collections as $collection) {
            $db->dropCollection($collection);
        }
    }
}
