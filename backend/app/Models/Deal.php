<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

/**
 * @OA\Schema(
 *   schema="Deal",
 *   @OA\Property(property="id",          type="string"),
 *   @OA\Property(property="company_id",  type="string"),
 *   @OA\Property(property="title",       type="string"),
 *   @OA\Property(property="contact_id",  type="string"),
 *   @OA\Property(property="assigned_to", type="string"),
 *   @OA\Property(property="stage",       type="string", enum={"prospecting","qualification","proposal","negotiation","closed_won","closed_lost"}),
 *   @OA\Property(property="amount",      type="number"),
 *   @OA\Property(property="closed_at",   type="string", format="date"),
 * )
 */
class Deal extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'deals';

    const STAGES = [
        'prospecting',
        'qualification',
        'proposal',
        'negotiation',
        'closed_won',
        'closed_lost',
    ];

    protected $fillable = [
        'company_id',
        'title',
        'contact_id',
        'lead_id',
        'assigned_to',
        'stage',
        'amount',
        'currency',
        'probability',
        'expected_close_date',
        'closed_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'float',
        'probability' => 'integer',
        'expected_close_date' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class, 'lead_id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
