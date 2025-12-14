<?php

declare(strict_types=1);

use App\Config\Env;
use App\Controllers\AuthController;
use App\Controllers\AdminUsersController;
use App\Controllers\HealthController;
use App\Controllers\NotificationsController;
use App\Controllers\PaymentsController;
use App\Controllers\RequestsController;
use App\Controllers\ReviewsController;
use App\Controllers\SitesController;
use App\Controllers\StatsController;
use App\Controllers\UsersController;
use App\Middleware\AuthMiddleware;
use App\Services\AuthService;
use App\Services\FileService;
use App\Services\PaymentService;
use App\Services\NotificationService;
use App\Utils\Response;

$authService = new AuthService($pdo);
$paymentService = new PaymentService($pdo);
$notificationService = new NotificationService($pdo);

$fileService = new FileService(
    Env::get('UPLOAD_DIR', 'public/uploads'),
    (int) Env::get('MAX_UPLOAD_SIZE', 5_000_000)
);

$authController = new AuthController($authService);
$adminUsersController = new AdminUsersController($pdo);
$healthController = new HealthController($pdo);
$usersController = new UsersController($authService);
$sitesController = new SitesController($pdo, $notificationService);
$requestsController = new RequestsController($pdo, $paymentService, $notificationService);
$paymentsController = new PaymentsController($paymentService, $fileService, $notificationService);
$notificationsController = new NotificationsController($pdo);
$reviewsController = new ReviewsController($pdo);
$statsController = new StatsController($pdo);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

// Normalize path for subfolder deployment (e.g. /tourism-new/backend/public/api/sites -> /api/sites)
$apiPos = strpos($path, '/api/');
if ($apiPos !== false) {
    $path = substr($path, $apiPos);
}

// Debug all requests
file_put_contents(__DIR__ . '/request_debug.log', date('[Y-m-d H:i:s] ') . "$method $path\n", FILE_APPEND);

$body = json_decode(file_get_contents('php://input'), true) ?? [];

$respond = static function (array $result): void {
    $status = isset($result['_status']) ? (int) $result['_status'] : 200;
    if (isset($result['_status'])) {
        unset($result['_status']);
    }

    Response::json($result, $status);
};

switch (true) {
    case $method === 'POST' && $path === '/api/auth/register':
        $respond($authController->register($body));
        break;

    case $method === 'POST' && $path === '/api/auth/login':
        $respond($authController->login($body));
        break;

    case $method === 'GET' && $path === '/api/users/me':
        $context = AuthMiddleware::requireToken();
        $respond($usersController->me($context));
        break;

    case $method === 'PATCH' && $path === '/api/users/me':
        $context = AuthMiddleware::requireToken();
        $respond($usersController->update($context, $body));
        break;

    case $method === 'GET' && $path === '/api/sites':
        $respond($sitesController->index());
        break;

    case $method === 'GET' && preg_match('#^/api/sites/(\d+)$#', $path, $matches):
        $respond($sitesController->show((int) $matches[1]));
        break;

    case $method === 'POST' && $path === '/api/sites':
        // Log incoming payload and auth header for diagnostics
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '(none)';
        file_put_contents(__DIR__ . '/debug_sites_store.log', date('[Y-m-d H:i:s] ') . "Auth: $authHeader\nBody: " . print_r($body, true) . "\n", FILE_APPEND);

        $context = AuthMiddleware::requireToken();
        $respond($sitesController->store($context, $body));
        break;

    case $method === 'PATCH' && preg_match('#^/api/sites/(\d+)$#', $path, $matches):
        $context = AuthMiddleware::requireToken();
        $respond($sitesController->update($context, (int) $matches[1], $body));
        break;

    case $method === 'DELETE' && preg_match('#^/api/sites/(\d+)$#', $path, $matches):
        $context = AuthMiddleware::requireToken();
        $respond($sitesController->delete((int) $matches[1]));
        break;

    case $method === 'PATCH' && preg_match('#^/api/sites/(\d+)/approve$#', $path, $matches):
        $context = AuthMiddleware::requireToken();
        $respond($sitesController->approve((int) $matches[1], $context));
        break;

    case $method === 'POST' && $path === '/api/requests':
        $context = AuthMiddleware::requireToken();
        $respond($requestsController->create($context, $body));
        break;

    case $method === 'GET' && $path === '/api/requests':
        $context = AuthMiddleware::requireToken();
        // If visitor, use listForVisitor
        if (($context['role'] ?? '') === 'visitor') {
            $respond($requestsController->listForVisitor((int) $context['sub']));
        } else {
            // Admin or Guide
            $respond($requestsController->listAll($context));
        }
        break;

    case $method === 'PATCH' && preg_match('#^/api/requests/(\d+)/approve$#', $path, $matches):
        $respond($requestsController->approve((int) $matches[1]));
        break;

    case $method === 'PATCH' && preg_match('#^/api/requests/(\d+)/reject$#', $path, $matches):
        $respond($requestsController->reject((int) $matches[1]));
        break;

    case $method === 'PATCH' && preg_match('#^/api/requests/(\d+)/assign-guide$#', $path, $matches):
        $guideId = (int) ($body['assigned_guide_id'] ?? 0);
        $respond($requestsController->assignGuide((int) $matches[1], $guideId));
        break;

    case $method === 'PATCH' && preg_match('#^/api/requests/(\d+)/status$#', $path, $matches):
        $context = AuthMiddleware::requireToken();
        $status = (string) ($body['status'] ?? 'pending');
        $respond($requestsController->updateStatus((int) $matches[1], $status, $context));
        break;

    case $method === 'POST' && $path === '/api/payments/chapa/create':
        $respond($paymentsController->createChapa($body));
        break;

    case $method === 'GET' && preg_match('#^/api/payments/chapa/verify/(.+)$#', $path, $matches):
        $respond($paymentsController->verifyByTxRef($matches[1]));
        break;

    case $method === 'POST' && $path === '/api/payments/proof':
        $respond($paymentsController->uploadProof($_FILES, $_POST + $body));
        break;

    case $method === 'GET' && $path === '/api/payments':
        $requestId = isset($_GET['request_id']) ? (int) $_GET['request_id'] : null;
        $respond($paymentsController->list($requestId));
        break;

    case $method === 'PATCH' && preg_match('#^/api/payments/(\d+)/verify$#', $path, $matches):
        $context = AuthMiddleware::requireToken();
        $respond($paymentsController->verify((int) $matches[1], $context));
        break;

    case $method === 'GET' && $path === '/api/health':
        $respond($healthController->status());
        break;

    case $method === 'GET' && $path === '/api/stats':
        $respond($statsController->getStats());
        break;

    // --- Admin Users ---
    case $method === 'GET' && $path === '/api/admin/users':
        $respond($adminUsersController->list());
        break;

    case $method === 'POST' && $path === '/api/admin/users':
        $respond($adminUsersController->create($body));
        break;

    case $method === 'PUT' && preg_match('#^/api/admin/users/(\d+)/status$#', $path, $matches):
        $respond($adminUsersController->updateStatus((int) $matches[1], $body));
        break;

    case $method === 'DELETE' && preg_match('#^/api/admin/users/(\d+)$#', $path, $matches):
        $respond($adminUsersController->delete((int) $matches[1]));
        break;

    case $method === 'GET' && $path === '/api/notifications':
        $context = AuthMiddleware::requireToken();
        $respond($notificationsController->index($context));
        break;

    case $method === 'PATCH' && preg_match('#^/api/notifications/(\d+)/read$#', $path, $matches):
        $context = AuthMiddleware::requireToken();
        $respond($notificationsController->markRead((int) $matches[1], $context));
        break;

    case $method === 'POST' && $path === '/api/reviews':
        $context = AuthMiddleware::requireToken();
        $respond($reviewsController->create($context, $body));
        break;

    case $method === 'GET' && $path === '/api/reviews':
        $siteId = isset($_GET['site_id']) ? (int) $_GET['site_id'] : null;
        $respond($reviewsController->list($siteId));
        break;

    default:
        Response::json(['error' => 'Not Found'], 404);
}
