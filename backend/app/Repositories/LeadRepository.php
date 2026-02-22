<?php

namespace App\Repositories;

use App\Models\Lead;
use Illuminate\Support\Collection;

class LeadRepository extends BaseRepository
{
    protected function model(): string
    {
        return Lead::class;
    }

    /**
     * Get leads summarized by status for the current tenant.
     */
    public function countByStatus(): Collection
    {
        return $this->query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->get();
    }

    /**
     * Get leads assigned to a specific user.
     */
    public function findByAssignee(string $userId): Collection
    {
        return $this->query()
            ->where('assigned_to', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Assign a lead to a user (tenant-safe).
     */
    public function assign(string $leadId, string $userId): Lead
    {
        return $this->update($leadId, ['assigned_to' => $userId]);
    }

    /**
     * Update lead status (tenant-safe).
     */
    public function updateStatus(string $leadId, string $status): Lead
    {
        return $this->update($leadId, ['status' => $status]);
    }

    /**
     * Search leads by title or tags.
     */
    public function search(string $term): Collection
    {
        return $this->query()
            ->where(function ($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                    ->orWhere('notes', 'like', "%{$term}%");
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
