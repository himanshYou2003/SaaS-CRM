<?php

namespace App\Repositories;

use App\Models\Deal;
use Illuminate\Support\Collection;

class DealRepository extends BaseRepository
{
    protected function model(): string
    {
        return Deal::class;
    }

    /**
     * Get deals grouped by pipeline stage.
     */
    public function getKanbanBoard(): Collection
    {
        $deals = $this->query()->orderBy('created_at', 'desc')->get();

        return collect(Deal::STAGES)->mapWithKeys(function (string $stage) use ($deals) {
            return [$stage => $deals->where('stage', $stage)->values()];
        });
    }

    /**
     * Update deal stage (triggers DealWon event if stage = closed_won).
     */
    public function updateStage(string $dealId, string $stage): Deal
    {
        $deal = $this->update($dealId, [
            'stage' => $stage,
            'closed_at' => in_array($stage, ['closed_won', 'closed_lost']) ? now() : null,
        ]);

        if ($stage === 'closed_won') {
            event(new \App\Events\DealWon($deal));
        }

        return $deal;
    }

    /**
     * Get total revenue for closed_won deals within a date range.
     */
    public function totalRevenue(?string $from = null, ?string $to = null): float
    {
        $query = $this->query()->where('stage', 'closed_won');

        if ($from) {
            $query->where('closed_at', '>=', $from);
        }
        if ($to) {
            $query->where('closed_at', '<=', $to);
        }

        return (float) $query->sum('amount');
    }
}
