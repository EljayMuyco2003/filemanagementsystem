-- Seed data for File Management Portal
-- Run this after schema.sql

-- Insert admin user (password: Admin@1234)
-- Hash generated with: bcrypt.hash('Admin@1234', 10)
INSERT INTO users (email, password_hash, role) VALUES
('admin@portal.com', '$2a$10$rZ8qH9YxH9YxH9YxH9YxHOqH9YxH9YxH9YxH9YxH9YxH9YxH9YxH9', 'admin');

-- Insert regular user (password: User@1234)
INSERT INTO users (email, password_hash, role) VALUES
('user@portal.com', '$2a$10$rZ8qH9YxH9YxH9YxH9YxHOqH9YxH9YxH9YxH9YxH9YxH9YxH9YxH9', 'user');

-- Insert profiles
INSERT INTO profiles (user_id, first_name, last_name, employee_id, department, position, office, contact_number) VALUES
(1, 'Admin', 'User', 'EMP001', 'IT', 'System Administrator', 'Main Office', '+1234567890'),
(2, 'John', 'Doe', 'EMP002', 'Operations', 'Staff', 'Branch Office', '+0987654321');

-- Insert sample templates
INSERT INTO templates (name, description, file_url, file_type) VALUES
('Leave Request Form', 'Employee leave application form', 'https://example.com/templates/leave-form.docx', 'docx'),
('Monthly Report', 'Monthly performance and activity report template', 'https://example.com/templates/monthly-report.xlsx', 'xlsx'),
('Project Plan', 'Comprehensive project planning and tracking template', 'https://example.com/templates/project-plan.pptx', 'pptx'),
('Budget Form', 'Annual budget planning and tracking spreadsheet', 'https://example.com/templates/budget-form.xlsx', 'xlsx'),
('Memorandum', 'Official memorandum template for internal communications', 'https://example.com/templates/memo.docx', 'docx'),
('Leave Request Form PDF', 'Employee leave application form in PDF format', 'https://example.com/templates/leave-request.pdf', 'pdf');

-- Note: You'll need to generate proper bcrypt hashes for the passwords
-- Use this Node.js code to generate hashes:
-- const bcrypt = require('bcryptjs');
-- console.log(await bcrypt.hash('Admin@1234', 10));
-- console.log(await bcrypt.hash('User@1234', 10));
