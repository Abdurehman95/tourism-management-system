<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Database;
use App\Config\Env;

Env::load();

try {
  $pdo = Database::make();
  echo "Connected to database.\n";

  // Check if column exists
  $stmt = $pdo->query("SHOW COLUMNS FROM Sites LIKE 'status'");
  if ($stmt->fetch()) {
    echo "Column 'status' already exists in 'Sites'.\n";
  } else {
    echo "Adding 'status' column to 'Sites'...\n";
    $pdo->exec("ALTER TABLE Sites ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'");
    echo "Column 'status' added successfully.\n";
  }

} catch (Throwable $e) {
  echo "Error: " . $e->getMessage() . "\n";
  exit(1);
}
