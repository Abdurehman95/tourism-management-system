<?php
// Simple router for PHP built-in server

$uri = urldecode(
  parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// If the file exists, return false to let the server handle it
if ($uri !== '/' && file_exists(__DIR__ . '/public' . $uri)) {
  return false;
}

// Otherwise, route to index.php
require_once __DIR__ . '/public/index.php';
