<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Collection;

class UserRepository extends BaseRepository
{
    protected function model(): string
    {
        return User::class;
    }

    public function findByEmail(string $email): ?User
    {
        return $this->query()->where('email', $email)->first();
    }

    public function findByRole(string $roleId): Collection
    {
        return $this->query()->where('role_id', $roleId)->get();
    }

    public function assignRole(string $userId, string $roleId): User
    {
        return $this->update($userId, ['role_id' => $roleId]);
    }

    public function deactivate(string $userId): User
    {
        return $this->update($userId, ['is_active' => false]);
    }
}
