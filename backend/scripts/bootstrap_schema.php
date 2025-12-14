<?php
// Bootstrap schema safely: creates DB if missing and creates tables if they do not exist.
// Uses current .env credentials.

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use App\Config\Env;
use App\Config\Database;
use PDO;
use PDOException;

Env::load();

$host = Env::get('DB_HOST', '127.0.0.1');
$port = Env::get('DB_PORT', 3306);
$dbName = Env::get('DB_NAME', 'tourism');
$user = Env::get('DB_USER', 'root');
$pass = Env::get('DB_PASS', '');

// Connect without DB first to create it if needed
$dsnNoDb = sprintf('mysql:host=%s;port=%s;charset=utf8mb4', $host, $port);
try {
    $pdoRoot = new PDO($dsnNoDb, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $pdoRoot->exec("CREATE DATABASE IF NOT EXISTS `$dbName` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;");
    echo "Database ensured: $dbName\n";
} catch (PDOException $e) {
    exit("Failed to create database: " . $e->getMessage() . "\n");
}

// Connect to target DB
$pdo = Database::make();

$exec = function (string $sql) use ($pdo) {
    $pdo->exec($sql);
};

// Users
$exec("CREATE TABLE IF NOT EXISTS Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    user_type ENUM('visitor','researcher','admin','guide','site_agent') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);");

// Roles
$exec("CREATE TABLE IF NOT EXISTS Roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);");

// UserRoles
$exec("CREATE TABLE IF NOT EXISTS UserRoles (
    user_role_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    role_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
);");

// Categories
$exec("CREATE TABLE IF NOT EXISTS Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);");

// Regions
$exec("CREATE TABLE IF NOT EXISTS Regions (
    region_id INT PRIMARY KEY AUTO_INCREMENT,
    region_name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Ethiopia'
);");

// Sites
$exec("CREATE TABLE IF NOT EXISTS Sites (
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
    nearby_attractions TEXT,
    researcher_id INT,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    FOREIGN KEY (region_id) REFERENCES Regions(region_id),
    FOREIGN KEY (created_by) REFERENCES Users(user_id),
    FOREIGN KEY (approved_by) REFERENCES Users(user_id)
);");

// SiteImages
$exec("CREATE TABLE IF NOT EXISTS SiteImages (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    site_id INT,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES Sites(site_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES Users(user_id)
);");

// GuideTypes
$exec("CREATE TABLE IF NOT EXISTS GuideTypes (
    guide_type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL,
    description TEXT,
    additional_fee DECIMAL(10, 2) DEFAULT 0
);");

// GuideRequests
$exec("CREATE TABLE IF NOT EXISTS GuideRequests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    visitor_id INT,
    site_id INT,
    guide_type_id INT,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    number_of_visitors INT NOT NULL,
    special_requirements TEXT,
    request_status ENUM('pending','approved','rejected','completed','cancelled') DEFAULT 'pending',
    assigned_guide_id INT,
    meeting_point TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES Users(user_id),
    FOREIGN KEY (site_id) REFERENCES Sites(site_id),
    FOREIGN KEY (guide_type_id) REFERENCES GuideTypes(guide_type_id),
    FOREIGN KEY (assigned_guide_id) REFERENCES Users(user_id)
);");

// PaymentMethods
$exec("CREATE TABLE IF NOT EXISTS PaymentMethods (
    method_id INT PRIMARY KEY AUTO_INCREMENT,
    method_name VARCHAR(50) NOT NULL,
    description TEXT
);");

// Payments
$exec("CREATE TABLE IF NOT EXISTS Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT UNIQUE,
    payment_method_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    reference_code VARCHAR(100) UNIQUE,
    payment_status ENUM('waiting','paid','confirmed','failed','cancelled','refunded') DEFAULT 'waiting',
    paid_at TIMESTAMP NULL,
    confirmed_by INT,
    confirmed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES GuideRequests(request_id),
    FOREIGN KEY (payment_method_id) REFERENCES PaymentMethods(method_id),
    FOREIGN KEY (confirmed_by) REFERENCES Users(user_id)
);");

// PaymentProofs
$exec("CREATE TABLE IF NOT EXISTS PaymentProofs (
    proof_id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id INT,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(20),
    transaction_id VARCHAR(100),
    amount_paid DECIMAL(10, 2),
    merchant_number VARCHAR(50),
    payment_date DATE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES Payments(payment_id) ON DELETE CASCADE
);");

// Visits
$exec("CREATE TABLE IF NOT EXISTS Visits (
    visit_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT,
    actual_visit_date DATE,
    actual_visit_time TIME,
    duration_minutes INT,
    guide_feedback TEXT,
    visitor_feedback TEXT,
    rating INT,
    status ENUM('upcoming','in_progress','completed','cancelled','no_show') DEFAULT 'upcoming',
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (request_id) REFERENCES GuideRequests(request_id)
);");

// SiteSubmissions
$exec("CREATE TABLE IF NOT EXISTS SiteSubmissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    researcher_id INT,
    site_id INT NULL,
    submission_type ENUM('new','update') NOT NULL,
    submission_data JSON,
    submission_status ENUM('pending','approved','rejected') DEFAULT 'pending',
    admin_feedback TEXT,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (researcher_id) REFERENCES Users(user_id),
    FOREIGN KEY (site_id) REFERENCES Sites(site_id),
    FOREIGN KEY (reviewed_by) REFERENCES Users(user_id)
);");

// ResearcherActivities
$exec("CREATE TABLE IF NOT EXISTS ResearcherActivities (
    activity_id INT PRIMARY KEY AUTO_INCREMENT,
    researcher_id INT,
    activity_type VARCHAR(50),
    description TEXT,
    related_site_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (researcher_id) REFERENCES Users(user_id),
    FOREIGN KEY (related_site_id) REFERENCES Sites(site_id)
);");

// Notifications
$exec("CREATE TABLE IF NOT EXISTS Notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('guide_request','payment','reminder','system','account') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_request_id INT NULL,
    related_payment_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (related_request_id) REFERENCES GuideRequests(request_id),
    FOREIGN KEY (related_payment_id) REFERENCES Payments(payment_id)
);");

// Reviews
$exec("CREATE TABLE IF NOT EXISTS Reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    visitor_id INT,
    site_id INT,
    visit_id INT,
    rating INT NOT NULL,
    comment TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES Users(user_id),
    FOREIGN KEY (site_id) REFERENCES Sites(site_id),
    FOREIGN KEY (visit_id) REFERENCES Visits(visit_id)
);");

// SiteGuideTypes
$exec("CREATE TABLE IF NOT EXISTS SiteGuideTypes (
    site_guide_id INT PRIMARY KEY AUTO_INCREMENT,
    site_id INT,
    guide_type_id INT,
    additional_fee DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (site_id) REFERENCES Sites(site_id) ON DELETE CASCADE,
    FOREIGN KEY (guide_type_id) REFERENCES GuideTypes(guide_type_id)
);");

echo "Schema bootstrap complete.\n";
