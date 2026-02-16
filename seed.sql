-- ===============================
-- Employee Attendance System
-- Seed Data
-- ===============================

-- Clear existing data (optional for fresh setup)
TRUNCATE TABLE attendance RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- ===============================
-- Users
-- Password for both accounts: password123
-- Pre-hashed using bcrypt
-- ===============================

INSERT INTO users (email, password, full_name, role)
VALUES
(
  'employee@example.com',
  '$2b$10$YlbgI7hBrdF4ahKV8ul.6u0RG0ro7f/URH.Lf/1VjFJipmegq4Lhy', 
  'Employee User',
  'employee'
),
(
  'manager@example.com',
  '$2b$10$YlbgI7hBrdF4ahKV8ul.6u0RG0ro7f/URH.Lf/1VjFJipmegq4Lhy', 
  'Manager User',
  'manager'
);

-- ===============================
-- Sample Attendance Records
-- ===============================

INSERT INTO attendance (
  user_id,
  date,
  check_in_time,
  check_out_time,
  total_hours,
  status,
  notes
)
VALUES
(
  1,
  CURRENT_DATE - INTERVAL '2 day',
  CURRENT_DATE - INTERVAL '2 day' + TIME '08:55',
  CURRENT_DATE - INTERVAL '2 day' + TIME '17:10',
  8.25,
  'present',
  NULL
),
(
  1,
  CURRENT_DATE - INTERVAL '1 day',
  CURRENT_DATE - INTERVAL '1 day' + TIME '09:20',
  CURRENT_DATE - INTERVAL '1 day' + TIME '14:00',
  4.67,
  'half-day',
  NULL
);
