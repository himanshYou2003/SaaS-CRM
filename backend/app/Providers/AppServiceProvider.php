<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use App\Repositories\LeadRepository;
use App\Repositories\ContactRepository;
use App\Repositories\DealRepository;
use App\Repositories\UserRepository;
use App\Services\LeadService;
use App\Services\ContactService;
use App\Services\DealService;
use App\Services\AuthService;
use App\Services\RoleService;
use App\Services\AnalyticsService;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind repositories as singletons
        $this->app->singleton(LeadRepository::class);
        $this->app->singleton(ContactRepository::class);
        $this->app->singleton(DealRepository::class);
        $this->app->singleton(UserRepository::class);

        // Bind services as singletons
        $this->app->singleton(LeadService::class);
        $this->app->singleton(ContactService::class);
        $this->app->singleton(DealService::class);
        $this->app->singleton(AuthService::class);
        $this->app->singleton(RoleService::class);
        $this->app->singleton(AnalyticsService::class);
    }

    public function boot(): void
    {
        // Use MongoDB-backed token model for Sanctum
        \Laravel\Sanctum\Sanctum::usePersonalAccessTokenModel(
            \App\Models\PersonalAccessToken::class
        );

        // Define the 'api' rate limiter (60 requests/min per user or IP)
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by(
                $request->user()?->id ?: $request->ip()
            );
        });

        // Force HTTPS in production
        if (app()->environment('production')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
