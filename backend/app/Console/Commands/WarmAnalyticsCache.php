<?php

namespace App\Console\Commands;

use App\Services\AnalyticsService;
use App\Models\Company;
use Illuminate\Console\Command;

class WarmAnalyticsCache extends Command
{
    protected $signature = 'analytics:warm-cache';
    protected $description = 'Pre-warm analytics Redis cache for all active companies';

    public function __construct(private readonly AnalyticsService $analyticsService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $companies = Company::where('is_active', true)->get(['_id']);

        foreach ($companies as $company) {
            // Bind company context for analytics service
            app()->instance('company_id', (string) $company->_id);

            try {
                $this->analyticsService->monthlyRevenue();
                $this->analyticsService->conversionRate();
                $this->analyticsService->salesPerformance();
                $this->analyticsService->monthlyLeadTrends();
                $this->info("Warmed cache for company: {$company->_id}");
            } catch (\Exception $e) {
                $this->error("Failed for {$company->_id}: {$e->getMessage()}");
            }
        }

        return Command::SUCCESS;
    }
}
