<?php

namespace App\DTO;

class DealDTO
{
    public function __construct(
        public readonly string $title,
        public readonly string $stage = 'prospecting',
        public readonly float $amount = 0,
        public readonly ?string $contactId = null,
        public readonly ?string $leadId = null,
        public readonly ?string $assignedTo = null,
        public readonly string $currency = 'USD',
        public readonly int $probability = 0,
        public readonly ?string $expectedCloseDate = null,
        public readonly ?string $notes = null,
    ) {
    }

    public static function fromRequest(\Illuminate\Http\Request $request): self
    {
        return new self(
            title: $request->string('title'),
            stage: $request->input('stage', 'prospecting'),
            amount: (float) $request->input('amount', 0),
            contactId: $request->input('contact_id'),
            leadId: $request->input('lead_id'),
            assignedTo: $request->input('assigned_to'),
            currency: $request->input('currency', 'USD'),
            probability: (int) $request->input('probability', 0),
            expectedCloseDate: $request->input('expected_close_date'),
            notes: $request->input('notes'),
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'title' => $this->title,
            'stage' => $this->stage,
            'amount' => $this->amount,
            'contact_id' => $this->contactId,
            'lead_id' => $this->leadId,
            'assigned_to' => $this->assignedTo,
            'currency' => $this->currency,
            'probability' => $this->probability,
            'expected_close_date' => $this->expectedCloseDate,
            'notes' => $this->notes,
        ], fn($v) => $v !== null && $v !== '');
    }
}
