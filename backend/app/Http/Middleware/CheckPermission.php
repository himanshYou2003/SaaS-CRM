<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * CheckPermission
 *
 * Route middleware alias: 'permission'
 * Usage: ->middleware('permission:create_lead')
 *        ->middleware('permission:create_lead,edit_lead')  (any of)
 */
class CheckPermission
{
    public function handle(Request $request, Closure $next, string ...$permissions): mixed
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Admin bypass
        if ($user->isAdmin()) {
            return $next($request);
        }

        foreach ($permissions as $permission) {
            if ($user->hasPermission($permission)) {
                return $next($request);
            }
        }

        return response()->json([
            'message' => 'You do not have permission to perform this action.',
            'required_permissions' => $permissions,
        ], 403);
    }
}
