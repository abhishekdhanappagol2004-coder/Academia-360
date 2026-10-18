# MySQL Commands for PowerShell Setup

## Step 1: Connect to MySQL

**If MySQL is in PATH:**
```powershell
mysql -u root -p
```

**If MySQL is NOT in PATH (use full path):**
```powershell
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

**Note:** Enter your MySQL root password when prompted.

---

## Step 2: Create Database

Once you're logged into MySQL, run:

```sql
CREATE DATABASE sarms;
```

Verify database was created:
```sql
SHOW DATABASES;
```

You should see `sarms` in the list.

---

## Step 3: Use the Database

```sql
USE sarms;
```

---

## Step 4: Import Schema File

**Option A: Exit MySQL and import from PowerShell:**

Exit MySQL first (type `exit` or `quit`), then:

**If MySQL is in PATH:**
```powershell
mysql -u root -p sarms < database\schema.sql
```

**If MySQL is NOT in PATH:**
```powershell
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p sarms < database\schema.sql
```

Enter your MySQL root password when prompted.

**Option B: Run SQL commands directly in MySQL:**

If you prefer to stay in MySQL, you can copy the contents of `database\schema.sql` and paste them.

---

## Step 5: Verify Tables Were Created

After importing, connect to MySQL again:
```powershell
mysql -u root -p sarms
```

Then run:
```sql
SHOW TABLES;
```

You should see tables like: `users`, `students`, `institutions`, `academic_years`, `subjects`, `marks`, `attendance`, etc.

---

## Step 6: Update Password Hashes

Connect to MySQL:
```powershell
mysql -u root -p sarms
```

Then run these UPDATE commands:

```sql
USE sarms;

UPDATE users SET password = '$2a$10$kU.UVOxYNwnZd6ptcEBLpuCnfLKdPnsVHFBMjI5ZNBUhQ0SuPfwza' WHERE email = 'admin@sarms.com';

UPDATE users SET password = '$2a$10$ssOP7YgsK5VbR4b/ENZ1w.DlFq0lniq/.ADk3lrq.ldvT86a6fWJm' WHERE email = 'faculty@sarms.com';

UPDATE users SET password = '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu' WHERE email = 'student@sarms.com';
```

---

## Step 7: Verify Users Were Created

```sql
SELECT id, email, role FROM users;
```

You should see 3 rows:
- admin@sarms.com (admin)
- faculty@sarms.com (faculty)
- student@sarms.com (student)

---

## Step 8: Exit MySQL

```sql
exit
```

or

```sql
quit
```

---

## Complete PowerShell Script (All Commands)

Here's the complete sequence of commands in PowerShell:

### First: Connect and Create Database

```powershell
# Connect to MySQL
mysql -u root -p

# Then in MySQL prompt, run:
CREATE DATABASE sarms;
SHOW DATABASES;
exit
```

### Second: Import Schema

```powershell
# From PowerShell (not in MySQL prompt):
mysql -u root -p sarms < database\schema.sql
```

### Third: Update Password Hashes

```powershell
# Connect to MySQL again
mysql -u root -p sarms
```

Then in MySQL prompt, paste and run:

```sql
USE sarms;

UPDATE users SET password = '$2a$10$kU.UVOxYNwnZd6ptcEBLpuCnfLKdPnsVHFBMjI5ZNBUhQ0SuPfwza' WHERE email = 'admin@sarms.com';

UPDATE users SET password = '$2a$10$ssOP7YgsK5VbR4b/ENZ1w.DlFq0lniq/.ADk3lrq.ldvT86a6fWJm' WHERE email = 'faculty@sarms.com';

UPDATE users SET password = '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu' WHERE email = 'student@sarms.com';

SELECT id, email, role FROM users;

exit
```

---

## Alternative: One-Line Import (If MySQL in PATH)

You can also import schema and update passwords in one go by creating a SQL file:

### Create a file `setup.sql` in your project root:

```sql
USE sarms;

-- Import schema commands from database\schema.sql
-- (Copy all CREATE TABLE statements from schema.sql here)

-- Update passwords
UPDATE users SET password = '$2a$10$kU.UVOxYNwnZd6ptcEBLpuCnfLKdPnsVHFBMjI5ZNBUhQ0SuPfwza' WHERE email = 'admin@sarms.com';
UPDATE users SET password = '$2a$10$ssOP7YgsK5VbR4b/ENZ1w.DlFq0lniq/.ADk3lrq.ldvT86a6fWJm' WHERE email = 'faculty@sarms.com';
UPDATE users SET password = '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu' WHERE email = 'student@sarms.com';
```

Then run:
```powershell
mysql -u root -p < setup.sql
```

---

## Quick Reference Commands

### Common MySQL Commands:

```sql
-- Show all databases
SHOW DATABASES;

-- Use a database
USE database_name;

-- Show all tables in current database
SHOW TABLES;

-- Show table structure
DESCRIBE table_name;

-- View all data in a table
SELECT * FROM table_name;

-- Exit MySQL
exit
```

### PowerShell Commands:

```powershell
# Connect to MySQL
mysql -u root -p

# Import SQL file
mysql -u root -p database_name < file.sql

# Execute SQL command directly
mysql -u root -p database_name -e "SELECT * FROM table_name;"
```

---

## Troubleshooting

### "mysql: command not found"

**Option 1:** Add MySQL to PATH:
- Find MySQL installation: Usually `C:\Program Files\MySQL\MySQL Server 8.0\bin\`
- Add to Windows PATH environment variable

**Option 2:** Use full path:
```powershell
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

### "Access denied"

- Check your MySQL root password
- Make sure you're using the correct username (`root`)

### "Unknown database"

- Make sure you created the `sarms` database first
- Verify with: `SHOW DATABASES;`

### File path issues

- Use backslash `\` in Windows PowerShell: `database\schema.sql`
- Make sure you're in the project directory: `cd C:\Users\Shashank\OneDrive\Desktop\PROJECT`

