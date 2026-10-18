# Next Steps After Installing Node.js

## ✅ Step 1: Verify Node.js Installation

**IMPORTANT:** Close and reopen PowerShell/Command Prompt first!

Then run:
```powershell
node --version
npm --version
```

If you see version numbers (e.g., `v20.10.0` and `10.2.3`), Node.js is installed correctly!

## 📦 Step 2: Install Project Dependencies

Once Node.js is working, navigate to your project folder and install dependencies:

```powershell
cd C:\Users\Shashank\OneDrive\Desktop\PROJECT
npm install
```

This will install all required packages:
- express
- mysql2
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- body-parser
- nodemon (for development)

## 🗄️ Step 3: Setup MySQL Database

### Option A: Using Command Line

1. **Create the database:**
```powershell
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE sarms;
EXIT;
```

2. **Import the schema:**
```powershell
mysql -u root -p sarms < database\schema.sql
```

(Note: Use backslash `\` on Windows for the path)

### Option B: Using MySQL Workbench (Easier)

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Click "Create a new schema" (or File > New Query Tab)
4. Type: `CREATE DATABASE sarms;`
5. Execute the query
6. Right-click on `sarms` database > "Set as Default Schema"
7. File > Open SQL Script > Select `database\schema.sql`
8. Execute the entire script (⚡ lightning bolt icon)

## 🔐 Step 4: Generate Password Hashes

After installing dependencies, generate password hashes:

```powershell
node scripts\generate-password-hash.js
```

This will output SQL statements. Copy them and run in MySQL:

```sql
USE sarms;

UPDATE users SET password = 'generated_hash_for_admin' WHERE email = 'admin@sarms.com';
UPDATE users SET password = 'generated_hash_for_faculty' WHERE email = 'faculty@sarms.com';
UPDATE users SET password = 'generated_hash_for_student' WHERE email = 'student@sarms.com';
```

## ⚙️ Step 5: Create .env File

Create a file named `.env` in the project root folder (the project root folder)

**File content:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_root_password_here
DB_NAME=sarms
PORT=3000
JWT_SECRET=
```

**Replace `your_mysql_root_password_here`** with your actual MySQL root password.

## 🚀 Step 6: Start the Server

```powershell
npm start
```

You should see:
```
Connected to MySQL database
Server running on port 3000
```

## 🌐 Step 7: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

## 🔑 Step 8: Login

Use these credentials (after Step 4 is complete):

- **Admin**: admin@sarms.com / admin123
- **Faculty**: faculty@sarms.com / faculty123
- **Student**: student@sarms.com / student123

## 🔄 Complete Setup Checklist

- [ ] Node.js installed and verified (`node --version` works)
- [ ] Project dependencies installed (`npm install` completed)
- [ ] MySQL database `sarms` created
- [ ] Database schema imported (`schema.sql` executed)
- [ ] Password hashes generated and updated in database
- [ ] `.env` file created with correct database credentials
- [ ] Server starts successfully (`npm start`)
- [ ] Can access http://localhost:3000 in browser
- [ ] Can login with test credentials

## ❓ Still Having Issues?

### Node.js still not recognized?
- **Restart PowerShell completely** (close and reopen)
- Check if Node.js is installed: Look for `C:\Program Files\nodejs\` folder
- Add Node.js to PATH manually if needed (see INSTALL_NODEJS.md)

### MySQL connection errors?
- Check MySQL service is running
- Verify database credentials in `.env` file
- Make sure database `sarms` exists

### Password not working?
- Make sure you ran `node scripts\generate-password-hash.js`
- Verify password hashes were updated in database
- Check the UPDATE statements were executed correctly

