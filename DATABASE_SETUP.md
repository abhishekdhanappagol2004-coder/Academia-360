# Database Setup Guide

## Step 1: Check if MySQL is Installed

MySQL command line might not be in your PATH. Let's check:

### Option A: Using MySQL Workbench (Easier - Recommended)

1. **Open MySQL Workbench** (if installed)
   - Search for "MySQL Workbench" in Start Menu
   - If not installed, download from: https://dev.mysql.com/downloads/workbench/

2. **Connect to your MySQL server**
   - Click on your local MySQL connection (usually named "Local instance MySQL80" or similar)
   - Enter your root password if prompted

### Option B: Using Command Line

If MySQL is installed but not in PATH, you might need to use the full path:
```powershell
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" --version
```

Or add MySQL to your PATH.

## Step 2: Create Database

### Using MySQL Workbench:

1. **Connect to MySQL server** in MySQL Workbench

2. **Create new schema:**
   - Click the "Create a new schema" icon (cylinder with + sign)
   - Or go to: File > New Query Tab

3. **Enter this SQL:**
   ```sql
   CREATE DATABASE sarms;
   ```

4. **Execute** (⚡ lightning bolt icon, or Ctrl+Enter)

5. **Set as default schema:**
   - Right-click on `sarms` in the left panel
   - Select "Set as Default Schema"

### Using Command Line:

```powershell
mysql -u root -p -e "CREATE DATABASE sarms;"
```

Enter your MySQL root password when prompted.

## Step 3: Import Database Schema

### Using MySQL Workbench (Easier):

1. **Open the schema file:**
   - File > Open SQL Script
   - Navigate to: `C:\Users\Shashank\OneDrive\Desktop\PROJECT\database\schema.sql`
   - Click Open

2. **Execute the script:**
   - Make sure `sarms` database is selected in the left panel
   - Click the "Execute" button (⚡ lightning bolt icon)
   - Or press `Ctrl+Enter`

3. **Verify tables were created:**
   - In the left panel, expand `sarms` database
   - You should see tables: users, students, institutions, etc.

### Using Command Line:

```powershell
mysql -u root -p sarms < database\schema.sql
```

Or with full path if mysql is not in PATH:
```powershell
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p sarms < database\schema.sql
```

## Step 4: Generate Password Hashes

Now that npm is working, generate password hashes:

```powershell
node scripts\generate-password-hash.js
```

This will output SQL UPDATE statements. Copy them!

Example output:
```
admin: admin123
Hash: $2b$10$...

SQL: UPDATE users SET password = '$2b$10$...' WHERE email = 'admin@sarms.com';
```

## Step 5: Update Passwords in Database

### Using MySQL Workbench:

1. **Open a new query tab** (File > New Query Tab)

2. **Make sure `sarms` database is selected**

3. **Paste the SQL UPDATE statements** from Step 4

4. **Execute the queries** (⚡ lightning bolt icon)

Example:
```sql
USE sarms;

UPDATE users SET password = 'generated_hash_here' WHERE email = 'admin@sarms.com';
UPDATE users SET password = 'generated_hash_here' WHERE email = 'faculty@sarms.com';
UPDATE users SET password = 'generated_hash_here' WHERE email = 'student@sarms.com';
```

### Verify users were created:

```sql
SELECT id, email, role FROM users;
```

You should see 3 users:
- admin@sarms.com (admin)
- faculty@sarms.com (faculty)
- student@sarms.com (student)

## Step 6: Create .env File

Create a file named `.env` in your project root folder:

**Location:** `C:\Users\Shashank\OneDrive\Desktop\PROJECT\.env`

**Content:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_root_password_here
DB_NAME=sarms
PORT=3000
JWT_SECRET=
```

**Important:** Replace `your_mysql_root_password_here` with your actual MySQL root password!

## Step 7: Test Database Connection

After creating the .env file, test the connection:

```powershell
node -e "require('dotenv').config(); const mysql = require('mysql2'); const db = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME}); db.connect((err) => { if(err) console.error('Error:', err.message); else console.log('✅ Database connected successfully!'); db.end(); });"
```

If you see "✅ Database connected successfully!", you're ready to start the server!

## Troubleshooting

### MySQL Not Installed?

Download MySQL:
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download "MySQL Installer for Windows"
3. Run installer
4. Choose "Developer Default" or "Server only"
5. Set root password (remember it!)

### Can't Find MySQL?

It might be installed but not in PATH:
- Default location: `C:\Program Files\MySQL\MySQL Server 8.0\bin\`
- Add this to your PATH environment variable

### Database Connection Error?

- Check MySQL service is running (Services > MySQL80)
- Verify password in .env file
- Make sure database `sarms` exists
- Check MySQL is listening on localhost:3306

