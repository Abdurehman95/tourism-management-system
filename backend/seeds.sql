-- Seed Data for New Schema

-- 1. Users
-- Password is 'password123' ($2y$10$8DTcJk0jbCAwx3l3FI9GPO055WwVkjNRzw0i1LPb/CRzjqnC3NBeO)
INSERT INTO Users (first_name, last_name, email, phone_number, password_hash, user_type) VALUES 
('Admin', 'User', 'admin@example.com', '0911000000', '$2y$10$8DTcJk0jbCAwx3l3FI9GPO055WwVkjNRzw0i1LPb/CRzjqnC3NBeO', 'admin');

-- 2. Roles
INSERT INTO Roles (role_name, description) VALUES 
('Admin', 'Administrator with full access'),
('Guide', 'Tour guide'),
('Visitor', 'Tourist or visitor'),
('Researcher', 'Content creator and researcher');

-- 3. UserRoles
INSERT INTO UserRoles (user_id, role_id) VALUES 
(1, 1);

-- 4. Categories
INSERT INTO Categories (category_name, description) VALUES 
('Historical', 'Ancient historical sites'),
('Natural', 'Natural landscapes and parks'),
('Cultural', 'Cultural heritage sites');

-- 5. Regions
INSERT INTO Regions (region_name, city) VALUES 
('Amhara', 'Lalibela'),
('Tigray', 'Axum'),
('Oromia', 'Bale'),
('Addis Ababa', 'Addis Ababa');

-- 6. Sites
-- No mock sites

-- 8. Guide Types
INSERT INTO GuideTypes (type_name, description, additional_fee) VALUES 
('Standard', 'Standard tour guide', 0.00),
('Expert', 'Expert historian or specialist', 500.00);

-- 10. Payment Methods
INSERT INTO PaymentMethods (method_name, description) VALUES 
('Chapa', 'Chapa Online Payment'),
('Bank Transfer', 'Direct Bank Transfer');

-- 9. Guide Requests
-- No mock requests

-- 11. Payments
-- No mock payments

-- 16. Notifications
-- No mock notifications
