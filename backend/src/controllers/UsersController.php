<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;

class UsersController
{
    public function __construct(private AuthService $authService)
    {
    }

    public function me(array $context): array
    {
        return $this->authService->currentUser($context);
    }

    public function update(array $context, array $input): array
    {
        return $this->authService->updateProfile($context, $input);
    }
}
