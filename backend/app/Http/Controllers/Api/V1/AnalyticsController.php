<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Analytics", description="CRM Analytics Dashboard")
 */
class AnalyticsController extends Controller
{
    public function __construct(private readonly AnalyticsService $service)
    {
    }

    /**
     * @OA\Get(
     *   path="/api/v1/analytics/revenue",
     *   summary="Monthly revenue (closed_won deals)",
     *   tags={"Analytics"},
     *   security={{"bearerAuth":{}}},
     *   @OA\Response(response=200, description="Monthly revenue data"),
     * )
     */
    public function revenue(): JsonResponse
    {
        return response()->json(['data' => $this->service->monthlyRevenue()]);
    }

    /**
     * @OA\Get(path="/api/v1/analytics/conversion", summary="Lead conversion rate", tags={"Analytics"}, security={{"bearerAuth":{}}},
     *   @OA\Response(response=200, description="Conversion rate and breakdown by status"),
     * )
     */
    public function conversionRate(): JsonResponse
    {
        return response()->json(['data' => $this->service->conversionRate()]);
    }

    /**
     * @OA\Get(path="/api/v1/analytics/sales", summary="Sales performance per rep", tags={"Analytics"}, security={{"bearerAuth":{}}},
     *   @OA\Response(response=200, description="Top 10 sales reps by revenue"),
     * )
     */
    public function salesPerformance(): JsonResponse
    {
        return response()->json(['data' => $this->service->salesPerformance()]);
    }

    /**
     * @OA\Get(path="/api/v1/analytics/trends", summary="Monthly lead creation trends", tags={"Analytics"}, security={{"bearerAuth":{}}},
     *   @OA\Response(response=200, description="Lead trends for last 6 months"),
     * )
     */
    public function monthlyTrends(): JsonResponse
    {
        return response()->json(['data' => $this->service->monthlyLeadTrends()]);
    }
}
