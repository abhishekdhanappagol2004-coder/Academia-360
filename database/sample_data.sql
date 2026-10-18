-- Sample Data for SARMS Database
-- This file contains random/sample data for testing the application

USE sarms;

-- Insert sample institutions
INSERT INTO institutions (name, type, address) VALUES
('St. Joseph Primary School', 'School', '123 Main Street, Bangalore, Karnataka'),
('Government High School', 'School', '456 Park Avenue, Bangalore, Karnataka'),
('ABC PU College', 'PU', '789 College Road, Bangalore, Karnataka'),
('XYZ Engineering College', 'College', '321 Tech Park, Bangalore, Karnataka'),
('PQR University', 'University', '654 University Campus, Bangalore, Karnataka');

-- Insert sample users (students)
-- Note: Passwords are already hashed with bcrypt for "Student@123"
INSERT INTO users (email, password, role) VALUES
('john.doe@sarms.com', '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu', 'student'),
('jane.smith@sarms.com', '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu', 'student'),
('robert.johnson@sarms.com', '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu', 'student'),
('emily.williams@sarms.com', '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu', 'student'),
('michael.brown@sarms.com', '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu', 'student');

-- Insert sample students
INSERT INTO students (user_id, student_id, name, date_of_birth, age, address, parent_guardian_name, contact_number, gender, mentor_name) VALUES
(4, 'STU001', 'John Doe', '2005-03-15', 19, '123 Student Lane, Bangalore', 'Robert Doe', '9876543210', 'Male', 'Dr. Sarah Johnson'),
(5, 'STU002', 'Jane Smith', '2006-07-22', 18, '456 Student Avenue, Bangalore', 'Mary Smith', '9876543211', 'Female', 'Dr. Sarah Johnson'),
(6, 'STU003', 'Robert Johnson', '2005-11-08', 19, '789 Student Street, Bangalore', 'Linda Johnson', '9876543212', 'Male', 'Dr. Sarah Johnson'),
(7, 'STU004', 'Emily Williams', '2006-02-14', 18, '321 Student Road, Bangalore', 'James Williams', '9876543213', 'Female', 'Dr. Sarah Johnson'),
(8, 'STU005', 'Michael Brown', '2005-09-30', 19, '654 Student Circle, Bangalore', 'Patricia Brown', '9876543214', 'Male', 'Dr. Sarah Johnson');

-- Link students to institutions
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(1, 1, 2010, 2012, 'English'),
(1, 2, 2012, 2018, 'English'),
(1, 3, 2018, 2020, 'English'),
(1, 4, 2020, 2024, 'English'),
(2, 1, 2011, 2013, 'English'),
(2, 2, 2013, 2019, 'English'),
(2, 3, 2019, 2021, 'English'),
(2, 4, 2021, 2025, 'English'),
(3, 1, 2010, 2012, 'English'),
(3, 2, 2012, 2018, 'English'),
(3, 3, 2018, 2020, 'English'),
(3, 4, 2020, 2024, 'English');

-- Insert academic years for student 1 (John Doe)
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 1, '2010-2011', '1st Std', 'Complete'),
(1, 1, '2011-2012', '2nd Std', 'Complete'),
(1, 2, '2012-2013', '3rd Std', 'Complete'),
(1, 2, '2013-2014', '4th Std', 'Complete'),
(1, 2, '2014-2015', '5th Std', 'Complete'),
(1, 2, '2015-2016', '6th Std', 'Complete'),
(1, 2, '2016-2017', '7th Std', 'Complete'),
(1, 2, '2017-2018', '8th Std', 'Complete'),
(1, 3, '2018-2019', '11th Std', 'Complete'),
(1, 3, '2019-2020', '12th Std', 'Complete'),
(1, 4, '2020-2021', 'UG-I', 'Complete'),
(1, 4, '2021-2022', 'UG-II', 'Complete'),
(1, 4, '2022-2023', 'UG-III', 'Complete'),
(1, 4, '2023-2024', 'UG-IV', 'Complete');

-- Insert subjects for 10th Std (2017-2018) for student 1
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(8, 'Mathematics', 100),
(8, 'Science', 100),
(8, 'English', 100),
(8, 'Social Science', 100),
(8, 'Second Language', 100);

-- Insert marks for 10th Std subjects for student 1
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(1, 92, 'A+', 'Pass', 28),
(2, 88, 'A', 'Pass', 27),
(3, 85, 'A', 'Pass', 26),
(4, 90, 'A+', 'Pass', 28),
(5, 87, 'A', 'Pass', 27);

-- Insert subjects for 12th Std (2019-2020) for student 1
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(10, 'Physics', 70),
(10, 'Chemistry', 70),
(10, 'Mathematics', 70),
(10, 'English', 100),
(10, 'Computer Science', 70);

-- Insert marks for 12th Std subjects for student 1
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(6, 65, 'A+', 'Pass', 25),
(7, 60, 'A', 'Pass', 24),
(8, 68, 'A+', 'Pass', 25),
(9, 88, 'A+', 'Pass', 28),
(10, 70, 'A+', 'Pass', 28);

-- Insert subjects for B.Tech Semester 5 (2022-2023) for student 1
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(13, 'Data Structures', 70),
(13, 'Database Systems', 70),
(13, 'Computer Networks', 70),
(13, 'Operating Systems', 70),
(13, 'Software Engineering', 70);

-- Insert marks for B.Tech Semester 5 for student 1
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(11, 65, 'A+', 'Pass', 28),
(12, 60, 'A', 'Pass', 25),
(13, 58, 'A', 'Pass', 24),
(14, 62, 'A', 'Pass', 26),
(15, 64, 'A', 'Pass', 27);

-- Insert attendance records
INSERT INTO attendance (academic_year_id, total_working_days, days_attended, attendance_percentage, remarks) VALUES
(8, 220, 204, 92.73, 'Excellent attendance'),
(10, 200, 185, 92.50, 'Good attendance'),
(13, 180, 165, 91.67, 'Regular attendance');

-- Insert academic years for student 2 (Jane Smith)
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(2, 1, '2011-2012', '1st Std', 'Complete'),
(2, 2, '2013-2014', '3rd Std', 'Complete'),
(2, 2, '2017-2018', '10th Std', 'Complete'),
(2, 3, '2019-2020', '12th Std', 'Complete'),
(2, 4, '2021-2022', 'UG-I', 'Complete'),
(2, 4, '2022-2023', 'UG-II', 'Complete'),
(2, 4, '2023-2024', 'UG-III', 'Complete'),
(2, 4, '2024-2025', 'UG-IV', 'Ongoing');

-- Insert subjects for 10th Std (2017-2018) for student 2
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(28, 'Mathematics', 100),
(28, 'Science', 100),
(28, 'English', 100),
(28, 'Social Science', 100);

-- Insert marks for 10th Std for student 2
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(16, 95, 'A+', 'Pass', 29),
(17, 90, 'A+', 'Pass', 28),
(18, 88, 'A', 'Pass', 27),
(19, 92, 'A+', 'Pass', 28);

-- Insert subjects for 12th Std (2019-2020) for student 2
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(31, 'Physics', 70),
(31, 'Chemistry', 70),
(31, 'Biology', 70),
(31, 'English', 100);

-- Insert marks for 12th Std for student 2
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(20, 68, 'A+', 'Pass', 27),
(21, 65, 'A+', 'Pass', 26),
(22, 70, 'A+', 'Pass', 28),
(23, 90, 'A+', 'Pass', 29);

-- Insert attendance for student 2
INSERT INTO attendance (academic_year_id, total_working_days, days_attended, attendance_percentage, remarks) VALUES
(28, 220, 210, 95.45, 'Outstanding attendance'),
(31, 200, 195, 97.50, 'Excellent attendance');

-- Insert academic years for student 3 (Robert Johnson)
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(3, 1, '2010-2011', '1st Std', 'Complete'),
(3, 2, '2012-2013', '3rd Std', 'Complete'),
(3, 2, '2017-2018', '10th Std', 'Complete'),
(3, 3, '2019-2020', '12th Std', 'Complete'),
(3, 4, '2020-2021', 'UG-I', 'Complete'),
(3, 4, '2021-2022', 'UG-II', 'Complete'),
(3, 4, '2022-2023', 'UG-III', 'Complete'),
(3, 4, '2023-2024', 'UG-IV', 'Complete');

-- Insert subjects for 10th Std (2017-2018) for student 3
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(37, 'Mathematics', 100),
(37, 'Science', 100),
(37, 'English', 100),
(37, 'Social Science', 100);

-- Insert marks for 10th Std for student 3
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(24, 78, 'A', 'Pass', 25),
(25, 82, 'A', 'Pass', 26),
(26, 75, 'B+', 'Pass', 24),
(27, 80, 'A', 'Pass', 25);

-- Insert attendance for student 3
INSERT INTO attendance (academic_year_id, total_working_days, days_attended, attendance_percentage, remarks) VALUES
(37, 220, 198, 90.00, 'Good attendance');

-- Verify data inserted
SELECT 'Sample data inserted successfully!' as Status;
SELECT COUNT(*) as total_students FROM students;
SELECT COUNT(*) as total_institutions FROM institutions;
SELECT COUNT(*) as total_academic_years FROM academic_years;
SELECT COUNT(*) as total_subjects FROM subjects;
SELECT COUNT(*) as total_marks FROM marks;
SELECT COUNT(*) as total_attendance FROM attendance;

