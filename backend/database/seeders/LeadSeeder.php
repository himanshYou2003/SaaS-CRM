<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    private static array $TITLES = [
        'Enterprise Software Deal',
        'Cloud Migration Project',
        'Security Audit Contract',
        'ERP Implementation',
        'CRM Rollout',
        'Digital Transformation',
        'Data Analytics Platform',
        'Mobile App Development',
        'Web Redesign Project',
        'IoT Integration',
        'AI Chatbot Setup',
        'Managed Services Agreement',
        'Annual Support Contract',
        'SaaS Subscription Upgrade',
        'Marketing Automation',
        'HR System Overhaul',
        'Finance Module License',
        'Compliance Reporting Tool',
        'Logistics Software Deal',
        'Healthcare Platform',
        'E-commerce Solution',
        'Supply Chain Optimization',
        'Customer Portal Build',
        'Partner Portal Setup',
        'API Integration Services',
        'DevOps Consulting',
        'Infrastructure Audit',
        'Network Upgrade',
        'Cybersecurity Training',
        'Backup & Recovery',
        'Multi-site Rollout',
        'Staff Augmentation',
        'Product Launch Campaign',
        'Brand Identity Project',
        'SEO & Analytics Package',
        'Performance Optimization',
        'Database Migration',
        'Legacy Modernization',
        'Payment Gateway Integration',
        'Reporting Dashboard',
        'Inventory Management',
        'Field Service Software',
        'Reservation System',
        'Event Management Tool',
        'Learning Management System',
        'Customer Onboarding Flow',
        'Automated Billing Setup',
        'Predictive Analytics',
        'Document Management',
        'Workflow Automation',
    ];

    private static array $STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
    private static array $SOURCES = ['website', 'referral', 'cold_call', 'social_media', 'event', 'email_campaign', 'partner'];
    private static array $TAGS = ['hot', 'warm', 'cold', 'enterprise', 'smb', 'priority', 'follow-up', 'demo-scheduled'];
    private static array $FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Rahul', 'Priya', 'Anjali', 'Sneha', 'Deepak', 'Sunita', 'Meera'];
    private static array $LAST_NAMES = ['Sharma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Verma', 'Joshi', 'Mehta', 'Nair', 'Reddy'];

    public function run(): void
    {
        $user = User::where('email', config('seeder.email', 'himanshu@shipmymeds.com'))->firstOrFail();
        $companyId = (string) $user->company_id;

        $contactIds = Contact::where('company_id', $companyId)->pluck('_id')->map(fn($id) => (string) $id)->toArray();

        foreach (self::$TITLES as $i => $title) {
            Lead::create([
                'company_id' => $companyId,
                'title' => $title,
                'status' => self::$STATUSES[array_rand(self::$STATUSES)],
                'value' => round(rand(5000, 250000) + (rand(0, 99) / 100), 2),
                'source' => self::$SOURCES[array_rand(self::$SOURCES)],
                'tags' => array_slice(array_unique([
                    self::$TAGS[array_rand(self::$TAGS)],
                    self::$TAGS[array_rand(self::$TAGS)],
                ]), 0, 2),
                'notes' => 'Lead generated via ' . self::$SOURCES[array_rand(self::$SOURCES)]
                    . '. Decision maker: ' . self::$FIRST_NAMES[array_rand(self::$FIRST_NAMES)]
                    . ' ' . self::$LAST_NAMES[array_rand(self::$LAST_NAMES)] . '.',
                'expected_close_date' => now()->addDays(rand(15, 120)),
                'contact_id' => !empty($contactIds) ? $contactIds[array_rand($contactIds)] : null,
            ]);
        }

        $this->command->info('  Leads seeded: ' . count(self::$TITLES));
    }
}
