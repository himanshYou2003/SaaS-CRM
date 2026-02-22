<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

/**
 * @OA\Schema(
 *   schema="Role",
 *   @OA\Property(property="id",          type="string"),
 *   @OA\Property(property="company_id",  type="string"),
 *   @OA\Property(property="name",        type="string", example="Sales Manager"),
 *   @OA\Property(property="permissions", type="array", @OA\Items(type="string")),
 * )
 */
class Role extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'roles';

    protected $fillable = [
        'company_id',
        'name',
        'description',
        'permissions',
    ];

    protected $casts = [
        'permissions' => 'array',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }
}
