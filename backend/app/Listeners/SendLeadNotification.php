<?php

namespace App\Listeners;

use App\Events\LeadCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendLeadNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public string $queue = 'notifications';

    public function handle(LeadCreated $event): void
    {
        if (!$event->lead) {
            return;
        }

        $lead = $event->lead;

        Log::info("Lead created: [{$lead->_id}] {$lead->title} | Company: {$lead->company_id}");

        // In a real app: send email/Slack/push notification to assigned user
        // Mail::to($lead->assignedUser->email)->queue(new LeadAssignedMail($lead));
    }
}
