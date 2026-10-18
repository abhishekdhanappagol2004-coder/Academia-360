# Sample Data SQL Queries - Run One by One

## Step 1: Use the Database

```sql
USE sarms;
```

---

## Step 2: Insert Sample Institutions

**Run these one by one:**

```sql
INSERT INTO institutions (name, type, address) VALUES
('St. Joseph Primary School', 'School', '123 Main Street, Bangalore, Karnataka');
```

```sql
INSERT INTO institutions (name, type, address) VALUES
('Government High School', 'School', '456 Park Avenue, Bangalore, Karnataka');
```

```sql
INSERT INTO institutions (name, type, address) VALUES
('ABC PU College', 'PU', '789 College Road, Bangalore, Karnataka');
```

```sql
INSERT INTO institutions (name, type, address) VALUES
('XYZ Engineering College', 'College', '321 Tech Park, Bangalore, Karnataka');
```

```sql
INSERT INTO institutions (name, type, address) VALUES
('PQR University', 'University', '654 University Campus, Bangalore, Karnataka');
```

---

## Step 3: Insert Sample Student Users

**Run these one by one:**

```sql
INSERT INTO users (email, password, role) VALUES
('john.doe@sarms.com', '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu', 'student');
```

```sql
INSERT INTO users (email, password, role) VALUES
('jane.smith@sarms.com', '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu', 'student');
```

```sql
INSERT INTO users (email, password, role) VALUES
('robert.johnson@sarms.com', '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu', 'student');
```

```sql
INSERT INTO users (email, password, role) VALUES
('emily.williams@sarms.com', '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu', 'student');
```

```sql
INSERT INTO users (email, password, role) VALUES
('michael.brown@sarms.com', '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu', 'student');
```

---

## Step 4: Insert Sample Students

**Run these one by one:**

```sql
INSERT INTO students (user_id, student_id, name, date_of_birth, age, address, parent_guardian_name, contact_number, gender, mentor_name) VALUES
(4, 'STU001', 'John Doe', '2005-03-15', 19, '123 Student Lane, Bangalore', 'Robert Doe', '9876543210', 'Male', 'Dr. Sarah Johnson');
```

```sql
INSERT INTO students (user_id, student_id, name, date_of_birth, age, address, parent_guardian_name, contact_number, gender, mentor_name) VALUES
(5, 'STU002', 'Jane Smith', '2006-07-22', 18, '456 Student Avenue, Bangalore', 'Mary Smith', '9876543211', 'Female', 'Dr. Sarah Johnson');
```

```sql
INSERT INTO students (user_id, student_id, name, date_of_birth, age, address, parent_guardian_name, contact_number, gender, mentor_name) VALUES
(6, 'STU003', 'Robert Johnson', '2005-11-08', 19, '789 Student Street, Bangalore', 'Linda Johnson', '9876543212', 'Male', 'Dr. Sarah Johnson');
```

```sql
INSERT INTO students (user_id, student_id, name, date_of_birth, age, address, parent_guardian_name, contact_number, gender, mentor_name) VALUES
(7, 'STU004', 'Emily Williams', '2006-02-14', 18, '321 Student Road, Bangalore', 'James Williams', '9876543213', 'Female', 'Dr. Sarah Johnson');
```

```sql
INSERT INTO students (user_id, student_id, name, date_of_birth, age, address, parent_guardian_name, contact_number, gender, mentor_name) VALUES
(8, 'STU005', 'Michael Brown', '2005-09-30', 19, '654 Student Circle, Bangalore', 'Patricia Brown', '9876543214', 'Male', 'Dr. Sarah Johnson');
```

---

## Step 5: Link Students to Institutions

**Run these one by one (for John Doe - STU001):**

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(1, 1, 2010, 2012, 'English');
```

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(1, 2, 2012, 2018, 'English');
```

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(1, 3, 2018, 2020, 'English');
```

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(1, 4, 2020, 2024, 'English');
```

**For Jane Smith - STU002:**

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(2, 1, 2011, 2013, 'English');
```

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(2, 2, 2013, 2019, 'English');
```

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(2, 3, 2019, 2021, 'English');
```

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(2, 4, 2021, 2025, 'English');
```

**For Robert Johnson - STU003:**

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(3, 1, 2010, 2012, 'English');
```

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(3, 2, 2012, 2018, 'English');
```

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(3, 3, 2018, 2020, 'English');
```

```sql
INSERT INTO student_institutions (student_id, institution_id, start_year, end_year, medium_of_instruction) VALUES
(3, 4, 2020, 2024, 'English');
```

---

## Step 6: Insert Academic Years for John Doe (STU001)

**Run these one by one:**

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 1, '2010-2011', '1st Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 1, '2011-2012', '2nd Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 2, '2012-2013', '3rd Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 2, '2013-2014', '4th Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 2, '2014-2015', '5th Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 2, '2015-2016', '6th Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 2, '2016-2017', '7th Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 2, '2017-2018', '8th Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 3, '2018-2019', '11th Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 3, '2019-2020', '12th Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 4, '2020-2021', 'UG-I', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 4, '2021-2022', 'UG-II', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 4, '2022-2023', 'UG-III', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(1, 4, '2023-2024', 'UG-IV', 'Complete');
```

---

## Step 7: Insert Subjects for 10th Std (2017-2018) for John Doe

**First, check which academic_year_id is for 10th Std (should be id=8):**

```sql
SELECT id, academic_year, standard_class FROM academic_years WHERE student_id = 1 AND standard_class = '8th Std';
```

**Then run these (assuming id=8):**

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(8, 'Mathematics', 100);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(8, 'Science', 100);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(8, 'English', 100);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(8, 'Social Science', 100);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(8, 'Second Language', 100);
```

---

## Step 8: Insert Marks for 10th Std Subjects for John Doe

**First check subject IDs:**

```sql
SELECT id, subject_name FROM subjects WHERE academic_year_id = 8;
```

**Then insert marks (assuming subject IDs start from 1):**

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(1, 92, 'A+', 'Pass', 28);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(2, 88, 'A', 'Pass', 27);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(3, 85, 'A', 'Pass', 26);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(4, 90, 'A+', 'Pass', 28);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(5, 87, 'A', 'Pass', 27);
```

---

## Step 9: Insert Subjects for 12th Std (2019-2020) for John Doe

**Check academic_year_id for 12th Std (should be id=10):**

```sql
SELECT id FROM academic_years WHERE student_id = 1 AND standard_class = '12th Std';
```

**Then run (assuming id=10):**

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(10, 'Physics', 70);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(10, 'Chemistry', 70);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(10, 'Mathematics', 70);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(10, 'English', 100);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(10, 'Computer Science', 70);
```

---

## Step 10: Insert Marks for 12th Std Subjects for John Doe

**Check subject IDs:**

```sql
SELECT id, subject_name FROM subjects WHERE academic_year_id = 10;
```

**Then insert marks (assuming IDs start from 6):**

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(6, 65, 'A+', 'Pass', 25);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(7, 60, 'A', 'Pass', 24);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(8, 68, 'A+', 'Pass', 25);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(9, 88, 'A+', 'Pass', 28);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(10, 70, 'A+', 'Pass', 28);
```

---

## Step 11: Insert Subjects for B.Tech Semester 5 (2022-2023) for John Doe

**Check academic_year_id for UG-III (should be id=13):**

```sql
SELECT id FROM academic_years WHERE student_id = 1 AND standard_class = 'UG-III';
```

**Then run (assuming id=13):**

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(13, 'Data Structures', 70);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(13, 'Database Systems', 70);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(13, 'Computer Networks', 70);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(13, 'Operating Systems', 70);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(13, 'Software Engineering', 70);
```

---

## Step 12: Insert Marks for B.Tech Semester 5 for John Doe

**Check subject IDs:**

```sql
SELECT id, subject_name FROM subjects WHERE academic_year_id = 13;
```

**Then insert marks (assuming IDs start from 11):**

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(11, 65, 'A+', 'Pass', 28);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(12, 60, 'A', 'Pass', 25);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(13, 58, 'A', 'Pass', 24);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(14, 62, 'A', 'Pass', 26);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(15, 64, 'A', 'Pass', 27);
```

---

## Step 13: Insert Attendance Records for John Doe

**Run these:**

```sql
INSERT INTO attendance (academic_year_id, total_working_days, days_attended, attendance_percentage, remarks) VALUES
(8, 220, 204, 92.73, 'Excellent attendance');
```

```sql
INSERT INTO attendance (academic_year_id, total_working_days, days_attended, attendance_percentage, remarks) VALUES
(10, 200, 185, 92.50, 'Good attendance');
```

```sql
INSERT INTO attendance (academic_year_id, total_working_days, days_attended, attendance_percentage, remarks) VALUES
(13, 180, 165, 91.67, 'Regular attendance');
```

---

## Step 14: Insert Academic Years for Jane Smith (STU002)

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(2, 1, '2011-2012', '1st Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(2, 2, '2013-2014', '3rd Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(2, 2, '2017-2018', '10th Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(2, 3, '2019-2020', '12th Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(2, 4, '2021-2022', 'UG-I', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(2, 4, '2022-2023', 'UG-II', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(2, 4, '2023-2024', 'UG-III', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(2, 4, '2024-2025', 'UG-IV', 'Ongoing');
```

---

## Step 15: Insert Subjects and Marks for Jane Smith (10th Std)

**Check academic_year_id for Jane's 10th Std:**

```sql
SELECT id FROM academic_years WHERE student_id = 2 AND standard_class = '10th Std';
```

**Assuming id=28, insert subjects:**

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(28, 'Mathematics', 100);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(28, 'Science', 100);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(28, 'English', 100);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(28, 'Social Science', 100);
```

**Insert marks:**

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(16, 95, 'A+', 'Pass', 29);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(17, 90, 'A+', 'Pass', 28);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(18, 88, 'A', 'Pass', 27);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(19, 92, 'A+', 'Pass', 28);
```

---

## Step 16: Insert Attendance for Jane Smith

**Check academic_year_id:**

```sql
SELECT id FROM academic_years WHERE student_id = 2 AND standard_class = '10th Std';
```

**Insert attendance:**

```sql
INSERT INTO attendance (academic_year_id, total_working_days, days_attended, attendance_percentage, remarks) VALUES
(28, 220, 210, 95.45, 'Outstanding attendance');
```

**For 12th Std:**

```sql
SELECT id FROM academic_years WHERE student_id = 2 AND standard_class = '12th Std';
```

```sql
INSERT INTO attendance (academic_year_id, total_working_days, days_attended, attendance_percentage, remarks) VALUES
(31, 200, 195, 97.50, 'Excellent attendance');
```

---

## Step 17: Insert Academic Years for Robert Johnson (STU003)

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(3, 1, '2010-2011', '1st Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(3, 2, '2012-2013', '3rd Std', 'Complete');
```

```sql
INSERT INTO academic_years (student_id, institution_id, academic_year, standard_class, status) VALUES
(3, 2, '2017-2018', '10th Std', 'Complete');
```

**Insert subjects for 10th Std:**

```sql
SELECT id FROM academic_years WHERE student_id = 3 AND standard_class = '10th Std';
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(37, 'Mathematics', 100);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(37, 'Science', 100);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(37, 'English', 100);
```

```sql
INSERT INTO subjects (academic_year_id, subject_name, max_marks) VALUES
(37, 'Social Science', 100);
```

**Insert marks:**

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(24, 78, 'A', 'Pass', 25);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(25, 82, 'A', 'Pass', 26);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(26, 75, 'B+', 'Pass', 24);
```

```sql
INSERT INTO marks (subject_id, marks_obtained, grade, pass_fail, internal_marks) VALUES
(27, 80, 'A', 'Pass', 25);
```

**Insert attendance:**

```sql
INSERT INTO attendance (academic_year_id, total_working_days, days_attended, attendance_percentage, remarks) VALUES
(37, 220, 198, 90.00, 'Good attendance');
```

---

## Step 18: Verify Data

**Check counts:**

```sql
SELECT COUNT(*) as total_students FROM students;
```

```sql
SELECT COUNT(*) as total_institutions FROM institutions;
```

```sql
SELECT COUNT(*) as total_academic_years FROM academic_years;
```

```sql
SELECT COUNT(*) as total_subjects FROM subjects;
```

```sql
SELECT COUNT(*) as total_marks FROM marks;
```

```sql
SELECT COUNT(*) as total_attendance FROM attendance;
```

**View sample student:**

```sql
SELECT s.student_id, s.name, s.gender, u.email 
FROM students s 
JOIN users u ON s.user_id = u.id 
WHERE s.student_id = 'STU001';
```

**View academic timeline:**

```sql
SELECT s.name, ay.academic_year, ay.standard_class, i.name as institution_name
FROM students s
JOIN academic_years ay ON s.id = ay.student_id
JOIN institutions i ON ay.institution_id = i.id
WHERE s.student_id = 'STU001'
ORDER BY ay.academic_year;
```

---

## ⚠️ Important Notes:

1. **Check IDs First**: Before inserting marks/subjects, always check the actual IDs from your database as they may differ
2. **Run Queries in Order**: Follow the sequence to maintain referential integrity
3. **If Error Occurs**: Some data might already exist, that's okay - continue with next query
4. **Password**: All students use password: `Student@123`

## 🎉 Done!

After running all queries, you'll have sample data to test your application!

