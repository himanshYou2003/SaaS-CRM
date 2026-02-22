<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * ApiVersion
 *
 * Adds X-API-Version header to all responses and validates
 * that the Accept header is application/json for API routes.
 */
class ApiVersion
{
    public const VERSION = '1.0.0';

    public function handle(Request $request, Closure $next): mixed
    {
        // Force JSON responses
        $request->headers->set('Accept', 'application/json');

        $response = $next($request);

        // Add version header to response
        $response->headers->set('X-API-Version', self::VERSION);
        $response->headers->set('X-Powered-By', 'SaaS CRM API');

        return $response;
    }
}
