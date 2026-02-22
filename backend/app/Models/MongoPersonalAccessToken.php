<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use MongoDB\Laravel\Eloquent\DocumentModel;

class MongoPersonalAccessToken extends SanctumPersonalAccessToken
{
    use DocumentModel;
    protected $connection = 'mongodb';
    protected $collection = 'personal_access_tokens';

    protected $primaryKey = '_id';
    protected $keyType = 'string';
    public $incrementing = false;

    public function getKey()
    {
        $id = $this->attributes['_id'] ?? $this->attributes['id'] ?? null;

        if ($id instanceof \MongoDB\BSON\ObjectId) {
            return (string) $id;
        }

        if (is_array($id) && isset($id['$oid'])) {
            return $id['$oid'];
        }

        return (string) ($id ?? $this->getAttribute('_id') ?? $this->getAttribute('id') ?? $this->_id ?? $this->id);
    }


    protected $fillable = [
        'name',
        'token',
        'abilities',
        'expires_at',
        'tokenable_id',
        'tokenable_type',
    ];

    protected $hidden = ['token'];

    protected $casts = [
        'abilities' => 'array',
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function tokenable()
    {
        return $this->morphTo('tokenable');
    }

    public function can($ability): bool
    {
        return in_array('*', $this->abilities ?? []) ||
            in_array($ability, $this->abilities ?? []);
    }

    public function cant($ability): bool
    {
        return !$this->can($ability);
    }

    /**
     * Find a token by its plain-text value.
     */
    public static function findToken($token)
    {
        if (!str_contains($token, '|')) {
            return static::where('token', hash('sha256', $token))->first();
        }

        [$id, $token] = explode('|', $token, 2);

        // For MongoDB, we need to ensure the ID is handled correctly as a string or ObjectId
        if ($instance = static::find($id)) {
            return hash_equals($instance->token, hash('sha256', $token)) ? $instance : null;
        }

        return null;
    }
}
