<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=tourism', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Hash for 'Admin@123'
    $hash = password_hash('Admin@123', PASSWORD_BCRYPT);
    
    $stmt = $pdo->prepare('UPDATE Users SET password_hash = :h WHERE email = :e');
    $stmt->execute(['h' => $hash, 'e' => 'admin@example.com']);
    
    echo "Admin password reset successfully. Hash: $hash\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
