ALTER TABLE GuideRequests MODIFY COLUMN request_status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled', 'assigned', 'accepted_by_guide', 'rejected_by_guide') DEFAULT 'pending';
