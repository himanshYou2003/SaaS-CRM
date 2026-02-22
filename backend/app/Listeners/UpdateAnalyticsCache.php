<?php

namespace App\Listeners;

use App\Events\DealWon;
use App\Services\AnalyticsService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateAnalyticsCache implements ShouldQueue
{
    use InteractsWithQueue;

    public string $queue = 'analytics';

    public function __construct(private readonly AnalyticsService $analyticsService)
    {
    }

    public function handle(DealWon $event): void
    {
        $companyId = $event->deal?->company_id;

        if ($companyId) {
            $this->analyticsService->invalidateCache($companyId);
        }
    }
}
