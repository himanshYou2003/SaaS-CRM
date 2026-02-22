<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

/**
 * @OA\Schema(
 *   schema="Contact",
 *   @OA\Property(property="id",         type="string"),
 *   @OA\Property(property="company_id", type="string"),
 *   @OA\Property(property="name",       type="string"),
 *   @OA\Property(property="email",      type="string"),
 *   @OA\Property(property="phone",      type="string"),
 *   @OA\Property(property="company",    type="string", description="Lead company name"),
 *   @OA\Property(property="position",   type="string"),
 * )
 */
class Contact extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'contacts';

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'phone',
        'company',
        'position',
        'address',
        'social_links',
        'tags',
        'notes',
    ];

    protected $casts = [
        'social_links' => 'array',
        'tags' => 'array',
    ];

    public function leads()
    {
        return $this->hasMany(Lead::class, 'contact_id');
    }
}
