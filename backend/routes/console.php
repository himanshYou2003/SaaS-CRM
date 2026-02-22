<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// ── Scheduled Commands ────────────────────────────────────────────────────────
// Check and expire subscriptions daily at midnight
Schedule::command('subscriptions:check-expiry')->daily();

// Warm analytics cache every 15 minutes
Schedule::command('analytics:warm-cache')->everyFifteenMinutes();
