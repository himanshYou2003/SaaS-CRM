<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct(private readonly RoleService $service)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json(['data' => $this->service->listRoles()]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'sometimes|string',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'string',
        ]);

        $role = $this->service->createRole($request->only(['name', 'description', 'permissions']));
        return response()->json(['message' => 'Role created.', 'data' => $role], 201);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(['data' => $this->service->listRoles()->where('_id', $id)->first()]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|string|max:100',
            'permissions' => 'sometimes|array',
        ]);

        $role = $this->service->updateRole($id, $request->only(['name', 'description', 'permissions']));
        return response()->json(['message' => 'Role updated.', 'data' => $role]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->service->deleteRole($id);
        return response()->json(['message' => 'Role deleted.'], 204);
    }

    public function assignUser(Request $request, string $id): JsonResponse
    {
        $request->validate(['user_id' => 'required|string']);
        $this->service->assignUserToRole($id, $request->user_id);
        return response()->json(['message' => 'User assigned to role.']);
    }
}
