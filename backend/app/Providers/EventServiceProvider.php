<?php

namespace App\Providers;

use App\Events\LeadCreated;
use App\Events\DealWon;
use App\Events\SubscriptionExpired;
use App\Listeners\SendLeadNotification;
use App\Listeners\UpdateAnalyticsCache;
use App\Listeners\DisableCompanyAccess;
use App\Models\Lead;
use App\Models\Deal;
use App\Models\Contact;
use App\Policies\LeadPolicy;
use App\Policies\DealPolicy;
use App\Policies\ContactPolicy;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as BaseProvider;

class EventServiceProvider extends BaseProvider
{
    protected $listen = [
        LeadCreated::class => [
            SendLeadNotification::class,
        ],
        DealWon::class => [
            UpdateAnalyticsCache::class,
        ],
        SubscriptionExpired::class => [
            DisableCompanyAccess::class,
        ],
    ];

    protected $policies = [
        Lead::class => LeadPolicy::class,
        Deal::class => DealPolicy::class,
        Contact::class => ContactPolicy::class,
    ];

    public function boot(): void
    {
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
