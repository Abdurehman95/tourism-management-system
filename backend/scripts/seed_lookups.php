<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Database;

$pdo = Database::make();

// Ensure GuideTypes has at least one entry
$stmt = $pdo->query("SELECT count(*) FROM GuideTypes");
if ($stmt->fetchColumn() == 0) {
    $pdo->exec("INSERT INTO GuideTypes (type_name, description, additional_fee) VALUES ('Standard', 'Standard guide service', 0)");
    echo "Inserted default GuideType.\n";
} else {
    echo "GuideTypes already populated.\n";
}

// Ensure PaymentMethods has entries
$stmt = $pdo->query("SELECT count(*) FROM PaymentMethods");
if ($stmt->fetchColumn() == 0) {
    $pdo->exec("INSERT INTO PaymentMethods (method_name, description) VALUES ('Chapa', 'Online Payment'), ('Bank Transfer', 'Manual Transfer')");
    echo "Inserted default PaymentMethods.\n";
} else {
    echo "PaymentMethods already populated.\n";
}
