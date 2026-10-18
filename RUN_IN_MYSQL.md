# SQL Queries to Run in MySQL

## Step 1: Connect to MySQL Database

**In PowerShell:**
```powershell
mysql -u root -p sarms
```

*Enter your MySQL root password when prompted*

**Or if MySQL not in PATH:**
```powershell
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p sarms
```

---

## Step 2: Run These SQL Queries

**Once you're in MySQL (you'll see `mysql>`), copy and paste ALL of these queries:**

```sql
USE sarms;

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INT,
    address TEXT,
    parent_guardian_name VARCHAR(255),
    contact_number VARCHAR(20),
    mentor_name VARCHAR(255),
    gender ENUM('Male', 'Female', 'Other'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Institutions table
CREATE TABLE IF NOT EXISTS institutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('School', 'PU', 'College', 'University') NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Student-Institution mapping
CREATE TABLE IF NOT EXISTS student_institutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    institution_id INT NOT NULL,
    start_year YEAR NOT NULL,
    end_year YEAR,
    medium_of_instruction VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
);

-- 5. Academic years table
CREATE TABLE IF NOT EXISTS academic_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    institution_id INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    standard_class VARCHAR(50) NOT NULL,
    status ENUM('Complete', 'Ongoing') DEFAULT 'Complete',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
);

-- 6. Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academic_year_id INT NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    max_marks INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

-- 7. Marks table
CREATE TABLE IF NOT EXISTS marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    marks_obtained INT NOT NULL,
    grade VARCHAR(10),
    pass_fail ENUM('Pass', 'Fail') DEFAULT 'Pass',
    internal_marks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 8. Attendance records table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academic_year_id INT NOT NULL,
    total_working_days INT NOT NULL,
    days_attended INT NOT NULL,
    attendance_percentage DECIMAL(5,2),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

-- 9. Faculty table
CREATE TABLE IF NOT EXISTS faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Admin table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (email, password, role) VALUES 
('admin@sarms.com', 'PLACEHOLDER_UPDATE_WITH_BCRYPT_HASH', 'admin'),
('faculty@sarms.com', 'PLACEHOLDER_UPDATE_WITH_BCRYPT_HASH', 'faculty'),
('student@sarms.com', 'PLACEHOLDER_UPDATE_WITH_BCRYPT_HASH', 'student');

-- Verify tables were created
SHOW TABLES;

-- Verify users were inserted
SELECT id, email, role FROM users;
```

---

## Step 3: Verify Tables Were Created

After running all the queries, verify with:

```sql
SHOW TABLES;
```

You should see these 10 tables:
- admins
- attendance
- faculty
- institutions
- marks
- student_institutions
- students
- subjects
- users
- academic_years

---

## Step 4: Update Password Hashes

**Now update the password hashes (run these UPDATE queries):**

```sql
USE sarms;

UPDATE users SET password = '$2a$10$kU.UVOxYNwnZd6ptcEBLpuCnfLKdPnsVHFBMjI5ZNBUhQ0SuPfwza' WHERE email = 'admin@sarms.com';

UPDATE users SET password = '$2a$10$ssOP7YgsK5VbR4b/ENZ1w.DlFq0lniq/.ADk3lrq.ldvT86a6fWJm' WHERE email = 'faculty@sarms.com';

UPDATE users SET password = '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu' WHERE email = 'student@sarms.com';

-- Verify passwords were updated
SELECT id, email, role FROM users;
```

---

## Step 5: Exit MySQL

```sql
exit
```

---

## Quick Reference: Tables Created

1. **users** - User authentication (students, faculty, admin)
2. **students** - Student personal details
3. **institutions** - Educational institutions
4. **student_institutions** - Multi-institution tracking
5. **academic_years** - Academic year records
6. **subjects** - Subjects for each academic year
7. **marks** - Marks for each subject
8. **attendance** - Attendance records per academic year
9. **faculty** - Faculty profile information
10. **admins** - Admin profile information

---

## Troubleshooting

### "Table already exists" Error
- This is fine! The `CREATE TABLE IF NOT EXISTS` will skip if table exists
- You can continue with the next queries

### "Foreign key constraint fails"
- Make sure you create tables in order (users first, then students, etc.)
- The order matters because of foreign key dependencies

### "Unknown database 'sarms'"
- Make sure you created the database first: `CREATE DATABASE sarms;`
- Use the database: `USE sarms;`

