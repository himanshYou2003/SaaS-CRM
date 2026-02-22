<?php

namespace App\DTO;

class ContactDTO
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $email = null,
        public readonly ?string $phone = null,
        public readonly ?string $company = null,
        public readonly ?string $position = null,
        public readonly array $tags = [],
        public readonly ?string $notes = null,
    ) {
    }

    public static function fromRequest(\Illuminate\Http\Request $request): self
    {
        return new self(
            name: $request->string('name'),
            email: $request->input('email'),
            phone: $request->input('phone'),
            company: $request->input('company'),
            position: $request->input('position'),
            tags: $request->input('tags', []),
            notes: $request->input('notes'),
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'position' => $this->position,
            'tags' => $this->tags,
            'notes' => $this->notes,
        ], fn($v) => $v !== null && $v !== '');
    }
}
