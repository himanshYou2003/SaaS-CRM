<?php

namespace App\Listeners;

use App\Events\SubscriptionExpired;
use App\Models\Company;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class DisableCompanyAccess implements ShouldQueue
{
    use InteractsWithQueue;

    public string $queue = 'subscriptions';

    public function handle(SubscriptionExpired $event): void
    {
        $company = Company::find($event->companyId);

        if (!$company) {
            return;
        }

        $company->update(['is_active' => false]);

        // Flush tenant active cache
        \Illuminate\Support\Facades\Cache::forget("company_active:{$event->companyId}");

        Log::warning("Company disabled due to expired subscription: {$event->companyId}");

        // Send notification email to company admin
        // Mail::to($company->email)->queue(new SubscriptionExpiredMail($company));
    }
}
