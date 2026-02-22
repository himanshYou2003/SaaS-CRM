<?php

return [
    'default' => env('DB_CONNECTION', 'mongodb'),

    'connections' => [
        'mongodb' => [
            'driver' => 'mongodb',
            'dsn' => env('MONGODB_URI'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', 27017),
            'database' => (function () {
                $db = env('DB_DATABASE', 'crm_db');
                $token = $_SERVER['LARAVEL_PARALLEL_TESTING_TOKEN'] ?? $_ENV['LARAVEL_PARALLEL_TESTING_TOKEN'] ?? null;
                return $token ? "{$db}_{$token}" : $db;
            })(),
            'username' => env('DB_USERNAME', ''),
            'password' => env('DB_PASSWORD', ''),
            'options' => [
                'authSource' => env('MONGODB_AUTH_SOURCE', 'admin'),
                'db' => env('DB_DATABASE', 'crm_db'), // Ensure default db is set for Atlas
            ],
        ],
    ],

    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],
];
