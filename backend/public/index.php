<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Env;
use App\Config\Database;
use App\Utils\Response;

Env::load();

// Enable error reporting for debugging
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $pdo = Database::make();
} catch (Throwable $e) {
    Response::json([
        'error' => 'Database connection failed',
        'details' => $e->getMessage(),
    ], 500);
    exit;
}

require_once __DIR__ . '/../routes.php';
