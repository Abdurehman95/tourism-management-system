<?php

declare(strict_types=1);

namespace App\Config;

use Dotenv\Dotenv;

class Env
{
    public static function load(string $rootPath = __DIR__ . '/..'): void
    {
        $projectRoot = realpath($rootPath . '/..');
        if ($projectRoot === false) {
            return;
        }

        $envFile = $projectRoot . '/.env';
        if (file_exists($envFile)) {
            $dotenv = Dotenv::createImmutable($projectRoot);
            $dotenv->safeLoad();
        }
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $value = $_ENV[$key] ?? getenv($key);
        return $value !== false && $value !== null ? $value : $default;
    }
}
