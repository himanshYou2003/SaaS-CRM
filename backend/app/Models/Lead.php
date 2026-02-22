<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

/**
 * @OA\Schema(
 *   schema="Lead",
 *   @OA\Property(property="id",          type="string"),
 *   @OA\Property(property="company_id",  type="string"),
 *   @OA\Property(property="title",       type="string"),
 *   @OA\Property(property="contact_id",  type="string"),
 *   @OA\Property(property="assigned_to", type="string"),
 *   @OA\Property(property="status",      type="string", enum={"new","contacted","qualified","lost","won"}),
 *   @OA\Property(property="value",       type="number"),
 *   @OA\Property(property="tags",        type="array", @OA\Items(type="string")),
 *   @OA\Property(property="notes",       type="string"),
 * )
 */
class Lead extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'leads';

    const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

    protected $fillable = [
        'company_id',
        'title',
        'contact_id',
        'assigned_to',
        'status',
        'value',
        'tags',
        'source',
        'notes',
        'expected_close_date',
    ];

    protected $casts = [
        'tags' => 'array',
        'value' => 'float',
        'expected_close_date' => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
