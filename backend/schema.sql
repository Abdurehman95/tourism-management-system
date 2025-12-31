-- Drop existing tables if they exist (to avoid conflicts)
DROP DATABASE IF EXISTS tourism;
CREATE DATABASE tourism;
USE tourism;

-- 1. Users Table (Main user registration)
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    user_type ENUM('visitor', 'researcher', 'admin', 'guide', 'site_agent') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. User Roles (if multiple roles per user needed)
CREATE TABLE Roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- 3. User-Role Mapping
CREATE TABLE UserRoles (
    user_role_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    role_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
);

-- 4. Categories Table
CREATE TABLE Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- 5. Regions Table
CREATE TABLE Regions (
    region_id INT PRIMARY KEY AUTO_INCREMENT,
    region_name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Ethiopia'
);

-- 6. Historical Sites Table (Core table)
CREATE TABLE Sites (
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
    estimated_duration VARCHAR(50), -- e.g., "2-3 hours"
    category_id INT,
    region_id INT,
    created_by INT, -- researcher/admin who created
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT, -- admin who approved
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    FOREIGN KEY (region_id) REFERENCES Regions(region_id),
    FOREIGN KEY (created_by) REFERENCES Users(user_id),
    FOREIGN KEY (approved_by) REFERENCES Users(user_id)
);

-- 7. Site Images Table
CREATE TABLE SiteImages (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    site_id INT,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES Sites(site_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES Users(user_id)
);

-- 8. Guide Types Table
CREATE TABLE GuideTypes (
    guide_type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL,
    description TEXT,
    additional_fee DECIMAL(10, 2) DEFAULT 0
);

-- 9. Guide Requests Table (Visitor's booking)
CREATE TABLE GuideRequests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    visitor_id INT,
    site_id INT,
    guide_type_id INT,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    number_of_visitors INT NOT NULL,
    special_requirements TEXT,
    request_status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    assigned_guide_id INT,
    meeting_point TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES Users(user_id),
    FOREIGN KEY (site_id) REFERENCES Sites(site_id),
    FOREIGN KEY (guide_type_id) REFERENCES GuideTypes(guide_type_id),
    FOREIGN KEY (assigned_guide_id) REFERENCES Users(user_id)
);

-- 10. Payment Methods Table
CREATE TABLE PaymentMethods (
    method_id INT PRIMARY KEY AUTO_INCREMENT,
    method_name VARCHAR(50) NOT NULL,
    description TEXT
);

-- 11. Payments Table
CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT UNIQUE,
    payment_method_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    reference_code VARCHAR(100) UNIQUE,
    payment_status ENUM('waiting', 'paid', 'confirmed', 'failed', 'cancelled', 'refunded') DEFAULT 'waiting',
    paid_at TIMESTAMP NULL,
    confirmed_by INT,
    confirmed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES GuideRequests(request_id),
    FOREIGN KEY (payment_method_id) REFERENCES PaymentMethods(method_id),
    FOREIGN KEY (confirmed_by) REFERENCES Users(user_id)
);

-- 12. Payment Proofs Table
CREATE TABLE PaymentProofs (
    proof_id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id INT,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(20), -- jpg, png, pdf
    transaction_id VARCHAR(100),
    amount_paid DECIMAL(10, 2),
    merchant_number VARCHAR(50),
    payment_date DATE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES Payments(payment_id) ON DELETE CASCADE
);

-- 13. Visits Table (Scheduled/Completed)
CREATE TABLE Visits (
    visit_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT,
    actual_visit_date DATE,
    actual_visit_time TIME,
    duration_minutes INT,
    guide_feedback TEXT,
    visitor_feedback TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    status ENUM('upcoming', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'upcoming',
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (request_id) REFERENCES GuideRequests(request_id)
);

-- 14. Site Submissions Table (Researcher content submissions)
CREATE TABLE SiteSubmissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    researcher_id INT,
    site_id INT NULL, -- NULL if new site, has value if updating existing
    submission_type ENUM('new', 'update') NOT NULL,
    submission_data JSON, -- Stores all submitted data (name, description, etc.)
    submission_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_feedback TEXT,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (researcher_id) REFERENCES Users(user_id),
    FOREIGN KEY (site_id) REFERENCES Sites(site_id),
    FOREIGN KEY (reviewed_by) REFERENCES Users(user_id)
);

-- 15. Researcher Activities Log
CREATE TABLE ResearcherActivities (
    activity_id INT PRIMARY KEY AUTO_INCREMENT,
    researcher_id INT,
    activity_type VARCHAR(50), -- 'add_site', 'update_site', 'upload_image'
    description TEXT,
    related_site_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (researcher_id) REFERENCES Users(user_id),
    FOREIGN KEY (related_site_id) REFERENCES Sites(site_id)
);

-- 16. Notifications Table
CREATE TABLE Notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('guide_request', 'payment', 'reminder', 'system', 'account') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_request_id INT NULL,
    related_payment_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (related_request_id) REFERENCES GuideRequests(request_id),
    FOREIGN KEY (related_payment_id) REFERENCES Payments(payment_id)
);

-- 17. Reviews Table
CREATE TABLE Reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    visitor_id INT,
    site_id INT,
    visit_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES Users(user_id),
    FOREIGN KEY (site_id) REFERENCES Sites(site_id),
    FOREIGN KEY (visit_id) REFERENCES Visits(visit_id)
);

-- 18. Site-Guide Types Relationship (Which guide types available for which site)
CREATE TABLE SiteGuideTypes (
    site_guide_id INT PRIMARY KEY AUTO_INCREMENT,
    site_id INT,
    guide_type_id INT,
    additional_fee DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (site_id) REFERENCES Sites(site_id) ON DELETE CASCADE,
    FOREIGN KEY (guide_type_id) REFERENCES GuideTypes(guide_type_id)
);
