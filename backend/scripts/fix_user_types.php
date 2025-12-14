<?php

// Fixes missing user_type for site agents (setting them to 'guide')
// Run with: php backend/scripts/fix_user_types.php

declare(strict_types=1);

use App\Config\Database;

require __DIR__ . '/../vendor/autoload.php';

try {
    $pdo = Database::make();
    
    // Update empty user_type to 'guide' (assuming they are site agents)
    // We exclude admin, visitor, researcher if they are already set correctly.
    // The issue is specifically for site agents created with 'site_agent' value which got rejected to '' by ENUM.
    
    $sql = "UPDATE Users SET user_type = 'guide' WHERE user_type = '' OR user_type IS NULL";
    $stmt = $pdo->query($sql);
    
    echo "Updated " . $stmt->rowCount() . " users to type 'guide'.\n";
    
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
