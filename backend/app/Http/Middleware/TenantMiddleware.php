<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * TenantMiddleware
 *
 * Injects the authenticated user's company_id into the IoC container
 * so all downstream repositories auto-scope queries to the tenant.
 */
class TenantMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if (!$user || !$user->company_id) {
            return response()->json(['message' => 'Tenant context missing.'], 403);
        }

        // Bind company_id globally for use in repositories
        app()->instance('company_id', (string) $user->company_id);

        // Attach to request for easy access in controllers
        $request->merge(['_company_id' => (string) $user->company_id]);

        // Check company is active (cached 5 min)
        $isActive = Cache::remember(
            "company_active:{$user->company_id}",
            300,
            fn() => \App\Models\Company::where('_id', $user->company_id)->value('is_active')
        );

        if (!$isActive) {
            return response()->json([
                'message' => 'Your company account has been suspended.',
            ], 403);
        }

        return $next($request);
    }
}
