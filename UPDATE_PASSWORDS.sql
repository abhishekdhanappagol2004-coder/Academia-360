-- Update passwords in database with bcrypt hashes
-- Use these passwords: Admin@123, Faculty@123, Student@123

USE sarms;

-- Update admin password (Admin@123)
UPDATE users SET password = '$2a$10$AjrghuoD62uqVTJzjo7vHORqJE8gLUhQlEGFu..sEkH6VXQ/w3c9S' WHERE email = 'admin@sarms.com';

-- Update faculty password (Faculty@123)
UPDATE users SET password = '$2a$10$0FGydeRUDMV2iwW16yw4nuf9saM9h81wo/ry88ymptkyzIK0bmvYC' WHERE email = 'faculty@sarms.com';

-- Update student password (Student@123)
UPDATE users SET password = '$2a$10$uOBAAknaB4GWvWzJJf/R8.0MiUBHFRXNhC/JwzS98JVxQCWT9NMoy' WHERE email = 'student@sarms.com';

-- Verify passwords were updated
SELECT id, email, role, LEFT(password, 30) as password_hash_preview FROM users;

