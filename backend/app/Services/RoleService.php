<?php

namespace App\Services;

use App\Models\Role;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;

class RoleService
{
    public function __construct(private readonly UserRepository $userRepo)
    {
    }

    public function createRole(array $data): Role
    {
        $data['company_id'] = app('company_id');
        $role = Role::create($data);

        $this->invalidatePermissionCache();

        return $role;
    }

    public function updateRole(string $roleId, array $data): Role
    {
        $role = $this->findOrFail($roleId);
        $role->update($data);

        $this->invalidatePermissionCache();

        return $role->fresh();
    }

    public function deleteRole(string $roleId): void
    {
        $role = $this->findOrFail($roleId);

        // Prevent deleting the admin role
        if ($role->name === 'admin') {
            throw new \Exception('The admin role cannot be deleted.', 422);
        }

        $role->delete();
        $this->invalidatePermissionCache();
    }

    public function assignUserToRole(string $roleId, string $userId): void
    {
        $role = $this->findOrFail($roleId);
        $this->userRepo->assignRole($userId, $roleId);

        // Bust this specific user's permission cache
        Cache::forget("user_permissions:{$userId}");
    }

    public function listRoles(): Collection
    {
        return Role::where('company_id', app('company_id'))->get();
    }

    /**
     * Get cached permissions for a user (role + direct).
     */
    public function getCachedPermissions(\App\Models\User $user): array
    {
        return Cache::remember(
            "user_permissions:{$user->_id}",
            3600, // 1 hour
            function () use ($user) {
                $perms = $user->permissions ?? [];

                if ($user->role_id) {
                    $role = Role::find($user->role_id);
                    if ($role) {
                        $perms = array_merge($perms, $role->permissions ?? []);
                    }
                }

                return array_unique($perms);
            }
        );
    }

    private function findOrFail(string $roleId): Role
    {
        $role = Role::where('company_id', app('company_id'))
            ->where('_id', $roleId)
            ->first();

        if (!$role) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException('Role not found.');
        }

        return $role;
    }

    /**
     * Invalidate all permission caches for the current tenant.
     */
    private function invalidatePermissionCache(): void
    {
        // Flush user permission caches (tag-based if Redis supports it)
        // For simplicity, we bust individual user caches when roles change
        // A more scalable approach uses Cache tags: Cache::tags(['permissions'])->flush()
        $users = \App\Models\User::where('company_id', app('company_id'))->get(['_id']);
        foreach ($users as $user) {
            Cache::forget("user_permissions:{$user->_id}");
        }
    }
}
