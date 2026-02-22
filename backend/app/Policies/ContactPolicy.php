<?php

namespace App\Policies;

use App\Models\Contact;
use App\Models\User;

class ContactPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_contacts');
    }

    public function view(User $user, Contact $contact): bool
    {
        return $user->hasPermission('view_contacts')
            && (string) $contact->company_id === (string) $user->company_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('create_contact');
    }

    public function update(User $user, Contact $contact): bool
    {
        return $user->hasPermission('edit_contact')
            && (string) $contact->company_id === (string) $user->company_id;
    }

    public function delete(User $user, Contact $contact): bool
    {
        return $user->hasPermission('delete_contact')
            && (string) $contact->company_id === (string) $user->company_id;
    }
}
