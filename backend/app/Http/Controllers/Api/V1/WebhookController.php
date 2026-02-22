<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Handle incoming webhooks.
     * Validate against a shared secret, dispatch events.
     */
    public function handle(Request $request, string $event): JsonResponse
    {
        // Verify webhook signature
        $secret = config('app.webhook_secret', env('WEBHOOK_SECRET', 'changeme'));
        $signature = $request->header('X-Webhook-Signature');

        if ($signature !== hash_hmac('sha256', $request->getContent(), $secret)) {
            return response()->json(['message' => 'Invalid signature.'], 401);
        }

        Log::info("Webhook received: {$event}", $request->all());

        // Dispatch appropriate events
        match ($event) {
            'lead.created' => event(new \App\Events\LeadCreated(null)),
            'deal.won' => event(new \App\Events\DealWon(null)),
            'subscription.expired' => event(new \App\Events\SubscriptionExpired(
                $request->input('company_id')
            )),
            default => null,
        };

        return response()->json(['message' => 'Webhook processed.']);
    }
}
