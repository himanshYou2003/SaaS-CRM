<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\LeadController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\DealController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\SubscriptionController;
use App\Http\Controllers\Api\V1\WebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware(['api.version'])->group(function () {

    // ── Public routes ──────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // ── Webhook (signed, no auth) ─────────────────────────────────────────
    Route::post('/webhooks/{event}', [WebhookController::class, 'handle'])
        ->name('webhooks.handle');

    // ── Authenticated + Tenant-scoped routes ──────────────────────────────
    Route::middleware(['auth:sanctum', 'tenant'])->group(function () {

        // Auth
        Route::prefix('auth')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });

        // Leads
        Route::apiResource('leads', LeadController::class);
        Route::post('leads/{lead}/assign', [LeadController::class, 'assign']);
        Route::post('leads/{lead}/status', [LeadController::class, 'updateStatus']);

        // Contacts
        Route::apiResource('contacts', ContactController::class);

        // Deals
        Route::apiResource('deals', DealController::class);
        Route::post('deals/{deal}/stage', [DealController::class, 'updateStage']);

        // Roles & Permissions
        Route::apiResource('roles', RoleController::class);
        Route::post('roles/{role}/assign-user', [RoleController::class, 'assignUser']);

        // Analytics
        Route::prefix('analytics')->group(function () {
            Route::get('/revenue', [AnalyticsController::class, 'revenue']);
            Route::get('/conversion', [AnalyticsController::class, 'conversionRate']);
            Route::get('/sales', [AnalyticsController::class, 'salesPerformance']);
            Route::get('/trends', [AnalyticsController::class, 'monthlyTrends']);
        });

        // Subscriptions
        Route::prefix('subscription')->group(function () {
            Route::get('/', [SubscriptionController::class, 'show']);
            Route::post('/upgrade', [SubscriptionController::class, 'upgrade']);
            Route::post('/cancel', [SubscriptionController::class, 'cancel']);
        });

        // API Tokens
        Route::prefix('tokens')->group(function () {
            Route::get('/', [AuthController::class, 'listTokens']);
            Route::post('/', [AuthController::class, 'createToken']);
            Route::delete('/{tokenId}', [AuthController::class, 'revokeToken']);
        });
    });
});
