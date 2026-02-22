<?php

namespace App\Policies;

use App\Models\Deal;
use App\Models\User;

class DealPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_deals');
    }

    public function view(User $user, Deal $deal): bool
    {
        return $user->hasPermission('view_deals')
            && (string) $deal->company_id === (string) $user->company_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('create_deal');
    }

    public function update(User $user, Deal $deal): bool
    {
        return $user->hasPermission('edit_deal')
            && (string) $deal->company_id === (string) $user->company_id;
    }

    public function delete(User $user, Deal $deal): bool
    {
        return $user->hasPermission('delete_deal')
            && (string) $deal->company_id === (string) $user->company_id;
    }

    public function updateStage(User $user, Deal $deal): bool
    {
        return $user->hasPermission('update_deal_stage')
            && (string) $deal->company_id === (string) $user->company_id;
    }
}
