<?php

namespace App\DTO;

class LeadDTO
{
    public function __construct(
        public readonly string $title,
        public readonly ?string $contactId = null,
        public readonly ?string $assignedTo = null,
        public readonly string $status = 'new',
        public readonly float $value = 0,
        public readonly array $tags = [],
        public readonly ?string $source = null,
        public readonly ?string $notes = null,
        public readonly ?string $expectedCloseDate = null,
    ) {
    }

    public static function fromRequest(\Illuminate\Http\Request $request): self
    {
        return new self(
            title: $request->string('title'),
            contactId: $request->input('contact_id'),
            assignedTo: $request->input('assigned_to'),
            status: $request->input('status', 'new'),
            value: (float) $request->input('value', 0),
            tags: $request->input('tags', []),
            source: $request->input('source'),
            notes: $request->input('notes'),
            expectedCloseDate: $request->input('expected_close_date'),
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'title' => $this->title,
            'contact_id' => $this->contactId,
            'assigned_to' => $this->assignedTo,
            'status' => $this->status,
            'value' => $this->value,
            'tags' => $this->tags,
            'source' => $this->source,
            'notes' => $this->notes,
            'expected_close_date' => $this->expectedCloseDate,
        ], fn($v) => $v !== null && $v !== '');
    }
}
