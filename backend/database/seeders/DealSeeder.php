<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Seeder;

class DealSeeder extends Seeder
{
    private static array $TITLES = [
        'Enterprise License Renewal',
        'Cloud Services Contract',
        'Managed Support Deal',
        'Professional Services Engagement',
        'Platform Expansion Package',
        'Annual SaaS Agreement',
        'Consulting Retainer',
        'Implementation Project',
        'Technology Partnership',
        'Digital Upgrade Bundle',
        'Security Suite Contract',
        'Analytics Premium Plan',
        'Dedicated Account Package',
        'Growth Plan Upgrade',
        'Custom Development Deal',
        'Infrastructure Services',
        'Multi-year Support Agreement',
        'Training & Certification Bundle',
        'Integration Services Deal',
        'Premium Onboarding Package',
    ];

    private static array $STAGES = [
        'prospecting',
        'qualification',
        'proposal',
        'negotiation',
        'closed_won',
        'closed_lost',
    ];

    private static array $NOTES = [
        'High priority.',
        'Follow up next week.',
        'Awaiting proposal approval.',
        'In final negotiations.',
        'Demo completed.',
    ];

    private static array $SOURCES = ['website', 'referral', 'cold_call', 'social_media', 'event', 'email_campaign'];

    public function run(): void
    {
        $user = User::where('email', config('seeder.email', 'himanshu@shipmymeds.com'))->firstOrFail();
        $companyId = (string) $user->company_id;

        $contactIds = Contact::where('company_id', $companyId)->pluck('_id')->map(fn($id) => (string) $id)->toArray();
        $leadIds = Lead::where('company_id', $companyId)->pluck('_id')->map(fn($id) => (string) $id)->toArray();

        foreach (self::$TITLES as $title) {
            $stage = self::$STAGES[array_rand(self::$STAGES)];
            $closedAt = in_array($stage, ['closed_won', 'closed_lost'])
                ? now()->subDays(rand(1, 60))
                : null;

            Deal::create([
                'company_id' => $companyId,
                'title' => $title,
                'stage' => $stage,
                'amount' => round(rand(10000, 500000) + (rand(0, 99) / 100), 2),
                'currency' => 'INR',
                'probability' => rand(10, 95),
                'expected_close_date' => now()->addDays(rand(7, 90)),
                'closed_at' => $closedAt,
                'notes' => 'Deal sourced from ' . self::$SOURCES[array_rand(self::$SOURCES)]
                    . '. ' . self::$NOTES[array_rand(self::$NOTES)],
                'contact_id' => !empty($contactIds) ? $contactIds[array_rand($contactIds)] : null,
                'lead_id' => !empty($leadIds) ? $leadIds[array_rand($leadIds)] : null,
                'assigned_to' => (string) $user->_id,
            ]);
        }

        $this->command->info('  Deals seeded: ' . count(self::$TITLES));
    }
}
