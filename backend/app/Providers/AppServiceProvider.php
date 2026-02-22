<?php

namespace App\Providers;

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
        // Force HTTPS in production
        if (app()->environment('production')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
