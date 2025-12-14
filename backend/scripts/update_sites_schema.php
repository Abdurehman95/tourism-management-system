<?php

// Ensures Sites table has all necessary columns for researcher inputs.
// Run with: php backend/scripts/update_sites_schema.php

declare(strict_types=1);

use App\Config\Database;

require __DIR__ . '/../vendor/autoload.php';

try {
    $pdo = Database::make();
    
    // Check if Sites table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'Sites'");
    if (!$stmt->fetchColumn()) {
        // Create table if missing
        $sql = "CREATE TABLE Sites (
            site_id INT PRIMARY KEY AUTO_INCREMENT,
            site_name VARCHAR(200) NOT NULL,
            short_description TEXT,
            full_description LONGTEXT,
            location_address TEXT,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            visit_price DECIMAL(10, 2),
            entrance_fee DECIMAL(10, 2),
            guide_fee DECIMAL(10, 2),
            estimated_duration VARCHAR(50),
            category_id INT,
            region_id INT,
            created_by INT,
            is_approved BOOLEAN DEFAULT FALSE,
            approved_by INT,
            approved_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            image_url VARCHAR(255),
            map_url TEXT,
            nearby_attractions TEXT
        )";
        $pdo->exec($sql);
        echo "Created Sites table.\n";
    } else {
        // Add missing columns
        $columns = $pdo->query("SHOW COLUMNS FROM Sites")->fetchAll(PDO::FETCH_COLUMN);
        
        $adds = [];
        if (!in_array('full_description', $columns)) $adds[] = "ADD COLUMN full_description LONGTEXT";
        if (!in_array('short_description', $columns)) $adds[] = "ADD COLUMN short_description TEXT";
        if (!in_array('location_address', $columns)) $adds[] = "ADD COLUMN location_address TEXT";
        if (!in_array('visit_price', $columns)) $adds[] = "ADD COLUMN visit_price DECIMAL(10, 2)";
        if (!in_array('estimated_duration', $columns)) $adds[] = "ADD COLUMN estimated_duration VARCHAR(50)";
        if (!in_array('image_url', $columns)) $adds[] = "ADD COLUMN image_url VARCHAR(255)";
        if (!in_array('map_url', $columns)) $adds[] = "ADD COLUMN map_url TEXT";
        if (!in_array('nearby_attractions', $columns)) $adds[] = "ADD COLUMN nearby_attractions TEXT";
        if (!in_array('category', $columns)) $adds[] = "ADD COLUMN category VARCHAR(100)";
        if (!in_array('region', $columns)) $adds[] = "ADD COLUMN region VARCHAR(100)";
        if (!in_array('is_approved', $columns)) $adds[] = "ADD COLUMN is_approved BOOLEAN DEFAULT FALSE";
        if (!in_array('created_by', $columns)) $adds[] = "ADD COLUMN created_by INT";
        if (!in_array('researcher_id', $columns)) $adds[] = "ADD COLUMN researcher_id INT";

        if ($adds) {
            $pdo->exec("ALTER TABLE Sites " . implode(', ', $adds));
            echo "Added missing columns: " . count($adds) . "\n";
        } else {
            echo "Sites table schema is up to date.\n";
        }
    }
    
    echo "Schema update complete.\n";
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
