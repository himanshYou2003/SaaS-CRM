<?php

namespace App\Policies;

use App\Models\Lead;
use App\Models\User;

class LeadPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_leads');
    }

    public function view(User $user, Lead $lead): bool
    {
        return $user->hasPermission('view_leads')
            && (string) $lead->company_id === (string) $user->company_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('create_lead');
    }

    public function update(User $user, Lead $lead): bool
    {
        return $user->hasPermission('edit_lead')
            && (string) $lead->company_id === (string) $user->company_id;
    }

    public function delete(User $user, Lead $lead): bool
    {
        return $user->hasPermission('delete_lead')
            && (string) $lead->company_id === (string) $user->company_id;
    }

    public function assign(User $user, Lead $lead): bool
    {
        return $user->hasPermission('assign_lead')
            && (string) $lead->company_id === (string) $user->company_id;
    }
}
