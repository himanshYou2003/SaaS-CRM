<?php

namespace App\Services;

use App\Models\Lead;
use App\Repositories\LeadRepository;
use App\DTO\LeadDTO;
use App\Events\LeadCreated;

class LeadService
{
    public function __construct(private readonly LeadRepository $repo)
    {
    }

    public function getAll(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    public function find(string $id): Lead
    {
        return $this->repo->findOrFail($id);
    }

    public function create(LeadDTO $dto): Lead
    {
        $lead = $this->repo->create($dto->toArray());

        event(new LeadCreated($lead));

        return $lead;
    }

    public function update(string $id, LeadDTO $dto): Lead
    {
        return $this->repo->update($id, $dto->toArray());
    }

    public function delete(string $id): bool
    {
        return $this->repo->delete($id);
    }

    public function assign(string $leadId, string $userId): Lead
    {
        return $this->repo->assign($leadId, $userId);
    }

    public function updateStatus(string $leadId, string $status): Lead
    {
        if (!in_array($status, Lead::STATUSES)) {
            throw new \InvalidArgumentException("Invalid lead status: {$status}");
        }

        return $this->repo->updateStatus($leadId, $status);
    }

    public function search(string $term)
    {
        return $this->repo->search($term);
    }
}
