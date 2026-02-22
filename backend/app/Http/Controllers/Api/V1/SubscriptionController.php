<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $sub = Subscription::where('company_id', $request->user()->company_id)->first();
        return response()->json(['data' => $sub]);
    }

    public function upgrade(Request $request): JsonResponse
    {
        $request->validate(['plan' => 'required|in:' . implode(',', Subscription::PLANS)]);

        $planPrices = ['starter' => 0, 'pro' => 49, 'enterprise' => 199];

        $sub = Subscription::where('company_id', $request->user()->company_id)->first();
        $sub->update([
            'plan' => $request->plan,
            'status' => 'active',
            'price_per_month' => $planPrices[$request->plan],
            'expires_at' => now()->addMonth(),
        ]);

        return response()->json(['message' => 'Subscription upgraded.', 'data' => $sub]);
    }

    public function cancel(Request $request): JsonResponse
    {
        $sub = Subscription::where('company_id', $request->user()->company_id)->first();
        $sub->update(['status' => 'cancelled', 'cancelled_at' => now()]);
        return response()->json(['message' => 'Subscription cancelled.']);
    }
}
