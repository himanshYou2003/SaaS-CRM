<?php

namespace App\Services;

use App\Models\Deal;
use App\Repositories\DealRepository;
use App\DTO\DealDTO;

class DealService
{
    public function __construct(private readonly DealRepository $repo)
    {
    }

    public function getAll(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    public function getKanbanBoard(): array
    {
        return $this->repo->getKanbanBoard()->toArray();
    }

    public function find(string $id): Deal
    {
        return $this->repo->findOrFail($id);
    }

    public function create(DealDTO $dto): Deal
    {
        return $this->repo->create($dto->toArray());
    }

    public function update(string $id, DealDTO $dto): Deal
    {
        return $this->repo->update($id, $dto->toArray());
    }

    public function delete(string $id): bool
    {
        return $this->repo->delete($id);
    }

    /**
     * Move a deal to a new pipeline stage.
     * Fires DealWon event if stage is closed_won.
     */
    public function updateStage(string $dealId, string $stage): Deal
    {
        if (!in_array($stage, Deal::STAGES)) {
            throw new \InvalidArgumentException("Invalid deal stage: {$stage}");
        }

        return $this->repo->updateStage($dealId, $stage);
    }
}
