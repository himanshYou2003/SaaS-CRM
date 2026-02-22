<?php

namespace App\Services;

use App\Models\Contact;
use App\Repositories\ContactRepository;
use App\DTO\ContactDTO;

class ContactService
{
    public function __construct(private readonly ContactRepository $repo)
    {
    }

    public function getAll(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    public function find(string $id): Contact
    {
        return $this->repo->findOrFail($id);
    }

    public function create(ContactDTO $dto): Contact
    {
        return $this->repo->create($dto->toArray());
    }

    public function update(string $id, ContactDTO $dto): Contact
    {
        return $this->repo->update($id, $dto->toArray());
    }

    public function delete(string $id): bool
    {
        return $this->repo->delete($id);
    }

    public function search(string $term)
    {
        return $this->repo->search($term);
    }
}
