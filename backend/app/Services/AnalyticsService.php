<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * AnalyticsService
 *
 * Runs MongoDB aggregation pipelines for all CRM analytics.
 * Results are cached in Redis (15-min TTL) and invalidated by the DealWon event.
 */
class AnalyticsService
{
    private const CACHE_TTL = 900; // 15 minutes

    // ── Revenue ───────────────────────────────────────────────────────────────

    /**
     * Monthly revenue for the current year aggregated from closed_won deals.
     */
    public function monthlyRevenue(): array
    {
        $companyId = app('company_id');
        $cacheKey = "analytics:revenue:monthly:{$companyId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($companyId) {
            $collection = \DB::connection('mongodb')
                ->getCollection('deals');

            $pipeline = [
                [
                    '$match' => [
                        'company_id' => $companyId,
                        'stage' => 'closed_won',
                        'closed_at' => [
                            '$gte' => new \MongoDB\BSON\UTCDateTime(
                                now()->startOfYear()->getTimestampMs()
                            )
                        ],
                    ]
                ],
                [
                    '$group' => [
                        '_id' => [
                            'year' => ['$year' => '$closed_at'],
                            'month' => ['$month' => '$closed_at'],
                        ],
                        'total_revenue' => ['$sum' => '$amount'],
                        'deal_count' => ['$sum' => 1],
                    ]
                ],
                ['$sort' => ['_id.year' => 1, '_id.month' => 1]],
                [
                    '$project' => [
                        '_id' => 0,
                        'year' => '$_id.year',
                        'month' => '$_id.month',
                        'total_revenue' => 1,
                        'deal_count' => 1,
                    ]
                ],
            ];

            return iterator_to_array($collection->aggregate($pipeline));
        });
    }

    // ── Lead Conversion ───────────────────────────────────────────────────────

    /**
     * Lead conversion rate: won / total * 100.
     */
    public function conversionRate(): array
    {
        $companyId = app('company_id');
        $cacheKey = "analytics:conversion:{$companyId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($companyId) {
            $collection = \DB::connection('mongodb')->getCollection('leads');

            $pipeline = [
                ['$match' => ['company_id' => $companyId]],
                [
                    '$group' => [
                        '_id' => '$status',
                        'count' => ['$sum' => 1],
                    ]
                ],
            ];

            $results = iterator_to_array($collection->aggregate($pipeline));

            $total = array_sum(array_column($results, 'count'));
            $won = 0;
            $byStatus = [];

            foreach ($results as $row) {
                $byStatus[$row['_id']] = $row['count'];
                if ($row['_id'] === 'won') {
                    $won = $row['count'];
                }
            }

            return [
                'total' => $total,
                'won' => $won,
                'conversion_rate' => $total > 0 ? round(($won / $total) * 100, 2) : 0,
                'by_status' => $byStatus,
            ];
        });
    }

    // ── Sales Performance ─────────────────────────────────────────────────────

    /**
     * Per-user sales performance (deals won, revenue generated).
     */
    public function salesPerformance(): array
    {
        $companyId = app('company_id');
        $cacheKey = "analytics:sales_perf:{$companyId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($companyId) {
            $collection = \DB::connection('mongodb')->getCollection('deals');

            $pipeline = [
                [
                    '$match' => [
                        'company_id' => $companyId,
                        'stage' => 'closed_won',
                    ]
                ],
                [
                    '$group' => [
                        '_id' => '$assigned_to',
                        'total_revenue' => ['$sum' => '$amount'],
                        'deals_closed' => ['$sum' => 1],
                    ]
                ],
                ['$sort' => ['total_revenue' => -1]],
                ['$limit' => 10],
            ];

            $results = iterator_to_array($collection->aggregate($pipeline));

            // Enrich with user names
            $userIds = array_column($results, '_id');
            $users = \App\Models\User::whereIn('_id', $userIds)->get(['_id', 'name'])->keyBy('_id');

            return array_map(function ($row) use ($users) {
                $row['user_name'] = $users[$row['_id']]->name ?? 'Unknown';
                return $row;
            }, $results);
        });
    }

    // ── Monthly Trends ────────────────────────────────────────────────────────

    /**
     * Leads created per month over the last 6 months.
     */
    public function monthlyLeadTrends(): array
    {
        $companyId = app('company_id');
        $cacheKey = "analytics:lead_trends:{$companyId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($companyId) {
            $collection = \DB::connection('mongodb')->getCollection('leads');

            $pipeline = [
                [
                    '$match' => [
                        'company_id' => $companyId,
                        'created_at' => [
                            '$gte' => new \MongoDB\BSON\UTCDateTime(
                                now()->subMonths(6)->startOfMonth()->getTimestampMs()
                            )
                        ],
                    ]
                ],
                [
                    '$group' => [
                        '_id' => [
                            'year' => ['$year' => '$created_at'],
                            'month' => ['$month' => '$created_at'],
                        ],
                        'leads_created' => ['$sum' => 1],
                    ]
                ],
                ['$sort' => ['_id.year' => 1, '_id.month' => 1]],
                [
                    '$project' => [
                        '_id' => 0,
                        'year' => '$_id.year',
                        'month' => '$_id.month',
                        'leads_created' => 1,
                    ]
                ],
            ];

            return iterator_to_array($collection->aggregate($pipeline));
        });
    }

    /**
     * Invalidate all analytics caches for the current tenant.
     * Called by UpdateAnalyticsCache listener on DealWon event.
     */
    public function invalidateCache(?string $companyId = null): void
    {
        $cid = $companyId ?? app('company_id');
        Cache::forget("analytics:revenue:monthly:{$cid}");
        Cache::forget("analytics:conversion:{$cid}");
        Cache::forget("analytics:sales_perf:{$cid}");
        Cache::forget("analytics:lead_trends:{$cid}");
    }
}
