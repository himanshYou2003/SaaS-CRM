<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\DTO\RegisterDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Info(title="SaaS CRM API", version="1.0.0")
 * @OA\SecurityScheme(securityScheme="bearerAuth", type="http", scheme="bearer", bearerFormat="JWT")
 */
class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService)
    {
    }

    /**
     * @OA\Post(
     *   path="/api/v1/auth/register",
     *   summary="Register a new company and admin user",
     *   tags={"Auth"},
     *   @OA\RequestBody(@OA\JsonContent(
     *     required={"company_name","name","email","password"},
     *     @OA\Property(property="company_name", type="string"),
     *     @OA\Property(property="name",         type="string"),
     *     @OA\Property(property="email",        type="string"),
     *     @OA\Property(property="password",     type="string"),
     *   )),
     *   @OA\Response(response=201, description="Registered successfully"),
     * )
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'company_name' => 'required|string|min:2|max:100',
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|unique:mongodb.users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $result = $this->authService->registerCompany(RegisterDTO::fromRequest($request));

        return response()->json([
            'message' => 'Company registered successfully.',
            'data' => $result,
        ], 201);
    }

    /**
     * @OA\Post(path="/api/v1/auth/login", summary="Login", tags={"Auth"},
     *   @OA\RequestBody(@OA\JsonContent(
     *     required={"email","password"},
     *     @OA\Property(property="email",    type="string"),
     *     @OA\Property(property="password", type="string"),
     *   )),
     *   @OA\Response(response=200, description="Token returned"),
     * )
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $result = $this->authService->login($request->email, $request->password);

        return response()->json(['message' => 'Login successful.', 'data' => $result]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => $request->user()->load('role')]);
    }

    // ── API Token management ──────────────────────────────────────────────────

    public function listTokens(Request $request): JsonResponse
    {
        $tokens = $request->user()->tokens()->get(['id', 'name', 'last_used_at', 'created_at']);
        return response()->json(['data' => $tokens]);
    }

    public function createToken(Request $request): JsonResponse
    {
        $request->validate(['name' => 'required|string|max:100']);
        $token = $request->user()->createToken($request->name);
        return response()->json(['data' => ['token' => $token->plainTextToken]], 201);
    }

    public function revokeToken(Request $request, string $tokenId): JsonResponse
    {
        $request->user()->tokens()->where('id', $tokenId)->delete();
        return response()->json(['message' => 'Token revoked.']);
    }
}
