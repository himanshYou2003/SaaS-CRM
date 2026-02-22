<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use MongoDB\Laravel\Eloquent\DocumentModel;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    use DocumentModel;

    protected $connection = 'mongodb';
    protected $collection = 'personal_access_tokens';

    protected $primaryKey = '_id';
    protected $keyType = 'string';
    public $incrementing = false;

    public function getKeyName()
    {
        return '_id';
    }

    public function getKey()
    {
        return (string) $this->getAttribute('_id');
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
        \Illuminate\Support\Facades\Log::debug("PersonalAccessToken::findToken splitting", ['id' => $id, 'token_hash' => hash('sha256', $token)]);

        // For MongoDB, we need to ensure the ID is handled correctly as a string or ObjectId
        if ($instance = static::find($id)) {
            \Illuminate\Support\Facades\Log::debug("PersonalAccessToken::findToken instance found", ['instance_id' => $instance->_id]);
            return hash_equals($instance->token, hash('sha256', $token)) ? $instance : null;
        }

        \Illuminate\Support\Facades\Log::debug("PersonalAccessToken::findToken instance NOT found", ['id' => $id]);
        return null;
    }
}
