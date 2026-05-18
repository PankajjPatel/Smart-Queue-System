USE smart_queue_system;

-- Insert Roles
INSERT INTO role (role_name) VALUES ('CUSTOMER'), ('STAFF'), ('ADMIN');

-- Insert Sectors
INSERT INTO sector (sector_name) VALUES ('Hospital'), ('Bank'), ('College');

-- Insert Admin User (password: admin123)
-- Uses BCrypt, generate hash for 'admin123' -> $2a$10$xyz... using a placeholder here for sample, real hashed password applied in backend
INSERT INTO users (name, email, phone, password_hash, role_id) 
VALUES ('System Admin', 'admin@queue.com', '1234567890', '$2a$10$E4T83hKxjvB/ZpA3.Yx18.yTf13/GqW4/o1N/k/mN9wS4YpZ3fSg.', 3);

-- Insert Staff User (password: staff123)
INSERT INTO users (name, email, phone, password_hash, role_id) 
VALUES ('John Staff', 'staff@queue.com', '0987654321', '$2a$10$E4T83hKxjvB/ZpA3.Yx18.yTf13/GqW4/o1N/k/mN9wS4YpZ3fSg.', 2);

-- Insert Customer (password: user123)
INSERT INTO users (name, email, phone, password_hash, role_id) 
VALUES ('Alice User', 'alice@gmail.com', '1112223333', '$2a$10$E4T83hKxjvB/ZpA3.Yx18.yTf13/GqW4/o1N/k/mN9wS4YpZ3fSg.', 1);

-- Insert Locations
INSERT INTO location (name, address, sector_id) VALUES 
('City Hospital Main', '123 Health St', 1),
('State Bank Branch A', '456 Finance Ave', 2),
('Engineering College', '789 Educate Blvd', 3);

-- Insert Services
INSERT INTO service (service_name, sector_id, estimated_time_per_token_mins) VALUES
('OPD Consultation', 1, 15),
('Cash Deposit/Withdrawal', 2, 5),
('Admissions Query', 3, 10);

-- Insert Counters
INSERT INTO service_counter (name, location_id, service_id) VALUES
('OPD Counter 1', 1, 1),
('Teller 1', 2, 2),
('Admission Desk A', 3, 3);

-- Assign Staff to Counter 1
INSERT INTO staff_counter_assignment (user_id, counter_id) VALUES
(2, 1);

-- Initialize Queues
INSERT INTO queue (counter_id, current_average_wait_time, status) VALUES
(1, 15, 'ACTIVE'),
(2, 5, 'ACTIVE'),
(3, 10, 'ACTIVE');

-- Insert Sample Token for User
INSERT INTO token (user_id, queue_id, token_number, status) VALUES
(3, 1, 1, 'PENDING');
