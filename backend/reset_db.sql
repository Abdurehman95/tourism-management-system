USE tourism;

SET FOREIGN_KEY_CHECKS = 0;

-- Clear operational tables (Mock Data)
TRUNCATE TABLE notifications;
TRUNCATE TABLE payments;
TRUNCATE TABLE paymentproofs;
TRUNCATE TABLE visits;
TRUNCATE TABLE guiderequests;
TRUNCATE TABLE reviews;
TRUNCATE TABLE siteimages;
TRUNCATE TABLE sitesubmissions;
TRUNCATE TABLE researcheractivities;
TRUNCATE TABLE sites;

-- Reset Users
TRUNCATE TABLE users;

-- Insert Admin (admin@gmail.com / admin123)
-- Hash is for 'admin123'
INSERT INTO users (first_name, last_name, email, user_type, password_hash, is_active, created_at, updated_at) VALUES 
('Admin', 'User', 'admin@gmail.com', 'admin', '$2y$10$2KY.TkQ2pSWJhJvNDOARM.E76FfSoSHEWfNRr3wABiWrAvcIKrktO', 1, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
