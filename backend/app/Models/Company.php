<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

/**
 * @OA\Schema(
 *   schema="Company",
 *   @OA\Property(property="id",          type="string"),
 *   @OA\Property(property="name",        type="string"),
 *   @OA\Property(property="slug",        type="string"),
 *   @OA\Property(property="email",       type="string"),
 *   @OA\Property(property="plan",        type="string", enum={"starter","pro","enterprise"}),
 *   @OA\Property(property="is_active",   type="boolean"),
 * )
 */
class Company extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'companies';

    protected $fillable = [
        'name',
        'slug',
        'email',
        'phone',
        'address',
        'plan',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function users()
    {
        return $this->hasMany(User::class, 'company_id');
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class, 'company_id');
    }
}
