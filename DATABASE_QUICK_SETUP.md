# Quick Database Setup Guide - Next Steps

## ✅ Progress So Far:
- ✅ Node.js installed
- ✅ npm working
- ✅ Dependencies installed (npm install)
- ✅ MySQL installed
- ✅ Password hashes generated

## 🔄 Next Steps:

### Step 1: Open MySQL Workbench

1. **Search for "MySQL Workbench" in Start Menu**
2. **Click on it to open**

### Step 2: Connect to MySQL Server

1. **In MySQL Workbench, you should see:**
   - "Local instance MySQL80" or similar connection
   - Double-click on it

2. **Enter your MySQL root password** (the one you set during installation)
   - Click "OK" or press Enter

3. **You should now see the MySQL Workbench interface**

### Step 3: Create Database

1. **Create a new query tab:**
   - Click the SQL button (or File > New Query Tab)
   - Or press `Ctrl+T`

2. **Enter this SQL command:**
   ```sql
   CREATE DATABASE sarms;
   ```

3. **Execute the query:**
   - Click the ⚡ lightning bolt icon
   - Or press `Ctrl+Enter`

4. **Verify database was created:**
   - In the left panel (Schemas), you should see `sarms`
   - Right-click on `sarms` > "Set as Default Schema"

### Step 4: Import Database Schema

1. **Open the schema file:**
   - In MySQL Workbench: File > Open SQL Script
   - Navigate to: `C:\Users\Shashank\OneDrive\Desktop\PROJECT\database\schema.sql`
   - Click "Open"

2. **Make sure `sarms` is selected:**
   - Check the dropdown at the top says "sarms"
   - If not, click the dropdown and select "sarms"

3. **Execute the script:**
   - Click the ⚡ lightning bolt icon (or Ctrl+Enter)
   - Wait for "Script executed successfully" message

4. **Verify tables were created:**
   - In the left panel, expand `sarms` database
   - You should see tables: `users`, `students`, `institutions`, `academic_years`, etc.

### Step 5: Update Password Hashes

1. **Create a new query tab** (Ctrl+T)

2. **Make sure `sarms` is selected** in the dropdown

3. **Paste these SQL UPDATE commands** (use the hashes already generated):

   ```sql
   USE sarms;

   UPDATE users SET password = '$2a$10$kU.UVOxYNwnZd6ptcEBLpuCnfLKdPnsVHFBMjI5ZNBUhQ0SuPfwza' WHERE email = 'admin@sarms.com';

   UPDATE users SET password = '$2a$10$ssOP7YgsK5VbR4b/ENZ1w.DlFq0lniq/.ADk3lrq.ldvT86a6fWJm' WHERE email = 'faculty@sarms.com';

   UPDATE users SET password = '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu' WHERE email = 'student@sarms.com';
   ```

4. **Execute the queries** (⚡ lightning bolt icon)

5. **Verify users were created:**
   ```sql
   SELECT id, email, role FROM users;
   ```
   You should see 3 rows:
   - admin@sarms.com (admin)
   - faculty@sarms.com (faculty)
   - student@sarms.com (student)

### Step 6: Create .env File

1. **Create a new file** in your project root folder:
   - Location: `C:\Users\Shashank\OneDrive\Desktop\PROJECT\.env`
   - **Note:** The file name is `.env` (starts with a dot)

2. **Add this content** (replace `your_mysql_password` with your actual MySQL root password):

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=sarms
   PORT=3000
   JWT_SECRET=my-super-secret-jwt-key-change-this-in-production
   ```

   **Example** (if your MySQL root password is `root123`):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root123
   DB_NAME=sarms
   PORT=3000
   JWT_SECRET=my-super-secret-jwt-key-change-this-in-production
   ```

3. **Save the file** (Ctrl+S)

### Step 7: Test Database Connection

Now let's test if everything works:

```powershell
cd C:\Users\Shashank\OneDrive\Desktop\PROJECT
npm start
```

**You should see:**
```
Connected to MySQL database
Server running on port 3000
```

If you see an error, check:
- MySQL password in `.env` file is correct
- Database `sarms` exists
- MySQL service is running

### Step 8: Open in Browser

Once the server starts:
1. **Open your web browser**
2. **Go to:** http://localhost:3000
3. **You should see the login page!**

## 🎉 Login Credentials:

After completing Step 5 (updating password hashes), you can login with:

- **Admin**: 
  - Email: `admin@sarms.com`
  - Password: `admin123`

- **Faculty**: 
  - Email: `faculty@sarms.com`
  - Password: `faculty123`

- **Student**: 
  - Email: `student@sarms.com`
  - Password: `student123`

## 📋 Quick Checklist:

- [ ] MySQL Workbench opened and connected
- [ ] Database `sarms` created
- [ ] Schema file `database\schema.sql` executed
- [ ] Password hashes updated in database
- [ ] `.env` file created with correct MySQL password
- [ ] Server started successfully (`npm start`)
- [ ] Can access http://localhost:3000 in browser

## ❓ Troubleshooting:

### MySQL Workbench won't connect:
- Check MySQL service is running (Services > MySQL80)
- Verify root password is correct
- Try restarting MySQL service

### "Database doesn't exist" error:
- Make sure you created `sarms` database
- Check database name in `.env` file matches

### "Access denied" error:
- Verify MySQL root password in `.env` file
- Check `DB_USER` is set to `root`

### "Connection refused" error:
- Check MySQL service is running
- Verify MySQL is listening on port 3306

