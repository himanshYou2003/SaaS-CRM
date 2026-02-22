<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

/**
 * @OA\Schema(
 *   schema="User",
 *   @OA\Property(property="id",          type="string"),
 *   @OA\Property(property="company_id",  type="string"),
 *   @OA\Property(property="name",        type="string"),
 *   @OA\Property(property="email",       type="string"),
 *   @OA\Property(property="role_id",     type="string"),
 *   @OA\Property(property="permissions", type="array", @OA\Items(type="string")),
 * )
 */
class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'password',
        'role_id',
        'permissions',
        'is_active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'permissions' => 'array',
        'is_active' => 'boolean',
        'email_verified_at' => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    // ── Permission helpers ────────────────────────────────────────────────────

    /**
     * Check if user has a given permission (checks user-level and role-level).
     */
    public function hasPermission(string $permission): bool
    {
        // Direct user-level permissions
        if (in_array($permission, $this->permissions ?? [], true)) {
            return true;
        }

        // Role-based permissions (cached via Redis in RoleService)
        return $this->role && in_array($permission, $this->role->permissions ?? [], true);
    }

    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $perm) {
            if ($this->hasPermission($perm)) {
                return true;
            }
        }
        return false;
    }

    public function isAdmin(): bool
    {
        return $this->hasPermission('*') || ($this->role && $this->role->name === 'admin');
    }
}
