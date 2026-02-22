<?php

namespace App\Console\Commands;

use App\Events\SubscriptionExpired;
use App\Models\Subscription;
use Illuminate\Console\Command;

class CheckSubscriptionExpiry extends Command
{
    protected $signature = 'subscriptions:check-expiry';
    protected $description = 'Check for expired subscriptions and fire SubscriptionExpired events';

    public function handle(): int
    {
        $expired = Subscription::where('status', 'active')
            ->orWhere('status', 'trial')
            ->where('expires_at', '<=', now())
            ->get();

        if ($expired->isEmpty()) {
            $this->info('No expired subscriptions found.');
            return Command::SUCCESS;
        }

        foreach ($expired as $subscription) {
            event(new SubscriptionExpired($subscription->company_id));
            $subscription->update(['status' => 'expired']);
            $this->warn("Expired: company_id={$subscription->company_id}");
        }

        $this->info("Processed {$expired->count()} expired subscription(s).");
        return Command::SUCCESS;
    }
}
