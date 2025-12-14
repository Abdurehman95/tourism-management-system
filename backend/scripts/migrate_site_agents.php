<?php

// Adds 'site_agent' to user_type enum and updates existing guides to site_agent.
// Run with: php backend/scripts/migrate_site_agents.php

declare(strict_types=1);

use App\Config\Database;

require __DIR__ . '/../vendor/autoload.php';

try {
    $pdo = Database::make();

    // Add enum value if missing and keep other roles
    $pdo->exec("ALTER TABLE Users MODIFY user_type ENUM('visitor','researcher','admin','guide','site_agent') NOT NULL");

    // Convert existing guide rows to site_agent for consistency
    $stmt = $pdo->prepare("UPDATE Users SET user_type = 'site_agent' WHERE user_type = 'guide'");
    $stmt->execute();

    echo "Updated " . $stmt->rowCount() . " users to site_agent.\nMigration complete.\n";
} catch (Throwable $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
