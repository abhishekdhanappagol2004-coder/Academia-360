# Add Sample Data to Database

## Quick Guide to Add Random/Sample Data

Need a fast way to populate attendance for the five core demo students? Run:

```powershell
npm run seed:attendance
```

This script (see `scripts/seed-student-attendance.js`) will:

- Ensure the demo institutions exist
- Add/Update one academic year per student (STU001–STU005)
- Insert realistic attendance totals (78% – 95%)

After it finishes, the admin/faculty dashboards and each student profile (e.g., Jane Smith) will show attendance immediately.  
If you also want subjects/marks/history, continue with the SQL steps below which load the full dataset.

---

This will add sample data including:
- 5 sample students
- 5 sample institutions
- Multiple academic years per student
- Subjects and marks for various classes
- Attendance records

## Method 1: Using MySQL Command Line

**In PowerShell:**

```powershell
mysql -u root -p sarms < database\sample_data.sql
```

Enter your MySQL root password when prompted.

**Or if MySQL not in PATH:**

```powershell
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p sarms < database\sample_data.sql
```

## Method 2: Using MySQL Workbench

1. **Open MySQL Workbench**
2. **Connect to your MySQL server**
3. **Select `sarms` database**
4. **File > Open SQL Script**
5. **Select:** `database\sample_data.sql`
6. **Execute the script** (⚡ button or Ctrl+Enter)

## Method 3: Copy and Paste in MySQL

1. **Connect to MySQL:**
   ```powershell
   mysql -u root -p sarms
   ```

2. **Copy contents** of `database\sample_data.sql`

3. **Paste in MySQL** and press Enter

## What Data Will Be Added?

### Students (5)
- John Doe (STU001)
- Jane Smith (STU002)
- Robert Johnson (STU003)
- Emily Williams (STU004)
- Michael Brown (STU005)

**Login credentials:**
- Email: `{firstname}.{lastname}@sarms.com` (e.g., `john.doe@sarms.com`)
- Password: `Student@123`

### Institutions (5)
- St. Joseph Primary School
- Government High School
- ABC PU College
- XYZ Engineering College
- PQR University

### Academic Records
- **John Doe:** Complete records from 1st Std to B.Tech 4th Year
  - 10th Std with 5 subjects and marks
  - 12th Std with 5 subjects and marks
  - B.Tech Semester 5 with 5 subjects and marks
  - Attendance records

- **Jane Smith:** Complete records from 1st Std to B.Tech 4th Year (Ongoing)
  - 10th Std with 4 subjects and marks
  - 12th Std with 4 subjects and marks
  - Attendance records

- **Robert Johnson:** Complete records from 1st Std to B.Tech 4th Year
  - 10th Std with 4 subjects and marks
  - Attendance records

## Verify Data Was Added

**In MySQL:**

```sql
USE sarms;

-- Check counts
SELECT COUNT(*) as total_students FROM students;
SELECT COUNT(*) as total_institutions FROM institutions;
SELECT COUNT(*) as total_academic_years FROM academic_years;
SELECT COUNT(*) as total_subjects FROM subjects;
SELECT COUNT(*) as total_marks FROM marks;
SELECT COUNT(*) as total_attendance FROM attendance;

-- View sample student data
SELECT s.student_id, s.name, s.gender, u.email 
FROM students s 
JOIN users u ON s.user_id = u.id 
LIMIT 5;

-- View student academic timeline
SELECT s.name, ay.academic_year, ay.standard_class, i.name as institution_name
FROM students s
JOIN academic_years ay ON s.id = ay.student_id
JOIN institutions i ON ay.institution_id = i.id
WHERE s.student_id = 'STU001'
ORDER BY ay.academic_year;
```

**Expected Results:**
- Total Students: 5
- Total Institutions: 5
- Total Academic Years: 22+
- Total Subjects: 20+
- Total Marks: 20+
- Total Attendance: 3+

## Test in Application

1. **Restart your server** (if running):
   ```powershell
   # Stop server (Ctrl+C), then:
   npm start
   ```

2. **Login as Faculty:**
   - Email: `faculty@sarms.com`
   - Password: `Faculty@123`

3. **Go to "View & Manage Records"**
   - Select student "STU001 - John Doe"
   - View all academic records, subjects, and marks

4. **Login as Student:**
   - Email: `john.doe@sarms.com`
   - Password: `Student@123`
   - View complete academic timeline

## Troubleshooting

### "Duplicate entry" error
- Data already exists, this is fine
- Delete existing data first if you want fresh sample data

### "Foreign key constraint fails"
- Make sure you ran the schema.sql first
- All tables must exist before adding data

### Want to Remove Sample Data?

```sql
USE sarms;

-- Remove sample data (keep structure)
DELETE FROM marks;
DELETE FROM subjects;
DELETE FROM attendance;
DELETE FROM academic_years;
DELETE FROM student_institutions;
DELETE FROM students WHERE student_id LIKE 'STU%';
DELETE FROM users WHERE email LIKE '%.%@sarms.com' AND role = 'student';
DELETE FROM institutions WHERE id > 3; -- Keep original admin/faculty/student users' institutions if any
```

## Customize Sample Data

You can edit `database\sample_data.sql` to:
- Add more students
- Change student names/details
- Add more academic years
- Add more subjects/marks
- Modify grades and attendance

**All sample data uses realistic values for testing!** 🎉

