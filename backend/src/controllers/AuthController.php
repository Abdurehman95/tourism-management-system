<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;

class AuthController
{
    public function __construct(private AuthService $authService)
    {
    }

    public function register(array $input): array
    {
        return $this->authService->register($input);
    }

    public function login(array $input): array
    {
        return $this->authService->login($input);
    }
}
