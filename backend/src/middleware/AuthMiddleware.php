<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Utils\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public static function requireToken(): array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!str_starts_with($header, 'Bearer ')) {
            Response::json(['error' => 'Authorization token missing'], 401);
            exit;
        }

        $token = substr($header, 7);

        try {
            $secret = $_ENV['JWT_SECRET'] ?? 'change-me';
            $payload = JWT::decode($token, new Key($secret, 'HS256'));
            return (array) $payload;
        } catch (\Throwable $e) {
            Response::json([
                'error' => 'Invalid token',
                'details' => $e->getMessage(),
            ], 401);
            exit;
        }
    }
}
