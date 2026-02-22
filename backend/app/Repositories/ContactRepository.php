<?php

namespace App\Repositories;

use App\Models\Contact;
use Illuminate\Support\Collection;

class ContactRepository extends BaseRepository
{
    protected function model(): string
    {
        return Contact::class;
    }

    public function findByEmail(string $email): ?Contact
    {
        return $this->query()->where('email', $email)->first();
    }

    public function search(string $term): Collection
    {
        return $this->query()
            ->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%")
                    ->orWhere('company', 'like', "%{$term}%");
            })
            ->orderBy('name', 'asc')
            ->get();
    }
}
