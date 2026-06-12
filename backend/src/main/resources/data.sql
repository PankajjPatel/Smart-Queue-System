USE Queue_DB;

-- Insert Roles
INSERT INTO role (role_name) VALUES ('CUSTOMER'), ('STAFF'), ('ADMIN');

-- Insert Sectors
INSERT INTO sector (sector_name) VALUES ('Hospital'), ('Bank'), ('College');

-- Insert Users (default password hash for 'admin123', 'staff123', 'user123' using BCrypt)
-- Hash: $2a$10$E4T83hKxjvB/ZpA3.Yx18.yTf13/GqW4/o1N/k/mN9wS4YpZ3fSg. is 'admin123', 'staff123', 'user123' respectively.
-- Admin User
INSERT INTO users (name, email, phone, password_hash, role_id) 
VALUES ('System Admin', 'admin@queue.com', '1234567890', '$2a$10$E4T83hKxjvB/ZpA3.Yx18.yTf13/GqW4/o1N/k/mN9wS4YpZ3fSg.', 3);

-- Staff Users
INSERT INTO users (name, email, phone, password_hash, role_id) 
VALUES ('John Staff', 'staff@queue.com', '0987654321', '$2a$10$E4T83hKxjvB/ZpA3.Yx18.yTf13/GqW4/o1N/k/mN9wS4YpZ3fSg.', 2);
INSERT INTO users (name, email, phone, password_hash, role_id) 
VALUES ('Bob Staff', 'bob@queue.com', '1122334455', '$2a$10$E4T83hKxjvB/ZpA3.Yx18.yTf13/GqW4/o1N/k/mN9wS4YpZ3fSg.', 2);
INSERT INTO users (name, email, phone, password_hash, role_id) 
VALUES ('Charlie Staff', 'charlie@queue.com', '5544332211', '$2a$10$E4T83hKxjvB/ZpA3.Yx18.yTf13/GqW4/o1N/k/mN9wS4YpZ3fSg.', 2);

-- Customer User
INSERT INTO users (name, email, phone, password_hash, role_id) 
VALUES ('Alice User', 'alice@gmail.com', '1112223333', '$2a$10$E4T83hKxjvB/ZpA3.Yx18.yTf13/GqW4/o1N/k/mN9wS4YpZ3fSg.', 1);

-- Insert Locations
INSERT INTO location (name, address, sector_id) VALUES 
('City Hospital Main', '123 Health St', 1),
('North Wing OPD', '246 Wellness Rd', 1),
('Apollo Downtown', '789 Care Ave', 1),
('Specialized Care Unit', '357 Clinic Blvd', 1),
('State Bank Branch A', '456 Finance Ave', 2),
('City Bank Central', '159 Ledger St', 2),
('Westside Branch', '753 Capital Rd', 2),
('Engineering College Campus', '789 Educate Blvd', 3),
('Medical College Block', '321 Scholar Way', 3),
('Arts Faculty HQ', '654 Culture Ln', 3);

-- Insert Services
INSERT INTO service (service_name, sector_id, estimated_time_per_token_mins) VALUES
-- Hospital Services
('General Consultation', 1, 15),
('Pediatrics', 1, 20),
('Pharmacy Counter', 1, 5),
('Blood Test', 1, 10),
('Cardiology Specialist', 1, 25),
-- Bank Services
('Cash Deposit', 2, 5),
('Cash Withdrawal', 2, 5),
('Loan Department', 2, 20),
('KYC Verification', 2, 10),
('Account Opening', 2, 15),
-- College Services
('Admissions Desk', 3, 15),
('Fee Payment Counter', 3, 8),
('Exam Department Office', 3, 12),
('Library Registration', 3, 6),
('Scholarship Desk', 3, 10);

-- Insert Service Counters
INSERT INTO service_counter (name, location_id, service_id) VALUES
-- Hospital Counters
('OPD Counter 1', 1, 1),
('Pediatric Desk', 1, 2),
-- Bank Counters
('Teller 1', 5, 6),
('KYC Desk 1', 5, 9),
-- College Counters
('Admission Desk A', 8, 11),
('Fee Counter 1', 8, 12);

-- Assign Staff to Counters
INSERT INTO staff_counter_assignment (user_id, counter_id) VALUES
(2, 1), -- John Staff to OPD Counter 1
(3, 3), -- Bob Staff to Teller 1
(4, 5); -- Charlie Staff to Admission Desk A

-- Initialize Queues
INSERT INTO queue (counter_id, current_average_wait_time, status) VALUES
(1, 15, 'ACTIVE'),
(2, 20, 'ACTIVE'),
(3, 5, 'ACTIVE'),
(4, 10, 'ACTIVE'),
(5, 15, 'ACTIVE'),
(6, 8, 'ACTIVE');

-- Insert Sample Tokens
INSERT INTO token (user_id, queue_id, token_number, status) VALUES
(5, 1, 1, 'PENDING');
