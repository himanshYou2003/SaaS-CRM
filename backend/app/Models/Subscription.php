<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Subscription extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'subscriptions';

    const PLANS = ['starter', 'pro', 'enterprise'];
    const STATUSES = ['active', 'expired', 'cancelled', 'trial'];

    protected $fillable = [
        'company_id',
        'plan',
        'status',
        'seats',
        'price_per_month',
        'started_at',
        'expires_at',
        'cancelled_at',
        'stripe_subscription_id',
        'metadata',
    ];

    protected $casts = [
        'seats' => 'integer',
        'price_per_month' => 'float',
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && $this->expires_at > now();
    }

    public function isExpired(): bool
    {
        return $this->expires_at <= now();
    }
}
