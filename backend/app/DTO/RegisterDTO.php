<?php

namespace App\DTO;

class RegisterDTO
{
    public function __construct(
        public readonly string $companyName,
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
    ) {
    }

    public static function fromRequest(\Illuminate\Http\Request $request): self
    {
        return new self(
            companyName: $request->string('company_name'),
            name: $request->string('name'),
            email: $request->string('email'),
            password: $request->string('password'),
        );
    }
}
