<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    private static array $FIRST_NAMES = [
        'Aarav',
        'Vivaan',
        'Aditya',
        'Sai',
        'Arjun',
        'Rahul',
        'Priya',
        'Anjali',
        'Sneha',
        'Neha',
        'Riya',
        'Pooja',
        'Rohit',
        'Amit',
        'Vikram',
        'Karan',
        'Deepak',
        'Sunita',
        'Meera',
        'Kavya',
    ];

    private static array $LAST_NAMES = [
        'Sharma',
        'Gupta',
        'Patel',
        'Singh',
        'Kumar',
        'Verma',
        'Joshi',
        'Mehta',
        'Nair',
        'Reddy',
        'Bose',
        'Das',
        'Jain',
        'Chowdhury',
        'Pillai',
    ];

    private static array $COMPANIES = [
        'TechNova',
        'CloudBase',
        'Infovista',
        'DataPeak',
        'SwiftSoft',
        'NexGen',
        'BrightOps',
        'ClearPath',
        'Momentum',
        'Pinnacle',
    ];

    private static array $POSITIONS = [
        'CEO',
        'CTO',
        'VP Sales',
        'Sales Manager',
        'Account Executive',
        'Business Dev',
        'Marketing Head',
        'Product Manager',
        'Operations Lead',
        'Director',
    ];

    private static array $TAGS = ['hot', 'warm', 'cold', 'enterprise', 'smb', 'priority'];

    private static array $SOURCES = ['website', 'referral', 'cold_call', 'social_media', 'event', 'email_campaign'];

    public function run(): void
    {
        $user = User::where('email', config('seeder.email', 'himanshu@shipmymeds.com'))->firstOrFail();
        $companyId = (string) $user->company_id;

        for ($i = 1; $i <= 10; $i++) {
            $name = $this->randomName();
            Contact::create([
                'company_id' => $companyId,
                'name' => $name,
                'email' => $this->randomEmail($name, $i),
                'phone' => '+91' . rand(7000000000, 9999999999),
                'company' => self::$COMPANIES[array_rand(self::$COMPANIES)],
                'position' => self::$POSITIONS[array_rand(self::$POSITIONS)],
                'tags' => array_slice(array_unique([
                    self::$TAGS[array_rand(self::$TAGS)],
                    self::$TAGS[array_rand(self::$TAGS)],
                ]), 0, 2),
                'notes' => 'Contacted via ' . self::$SOURCES[array_rand(self::$SOURCES)] . '.',
            ]);
        }

        $this->command->info('  Contacts seeded: 10');
    }

    private function randomName(): string
    {
        return self::$FIRST_NAMES[array_rand(self::$FIRST_NAMES)]
            . ' ' . self::$LAST_NAMES[array_rand(self::$LAST_NAMES)];
    }

    private function randomEmail(string $name, int $index): string
    {
        $slug = strtolower(str_replace(' ', '.', $name));
        $domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.io', 'corp.in'];
        return $slug . $index . '@' . $domains[array_rand($domains)];
    }
}
