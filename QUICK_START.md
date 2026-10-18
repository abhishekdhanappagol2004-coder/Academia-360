# Quick Start Guide - SARMS

## Prerequisites Checklist

Before starting, make sure you have:

- ✅ **Node.js** installed (v14 or higher)
  - Check: `node --version` in PowerShell
  - If not installed, see `INSTALL_NODEJS.md`
  
- ✅ **MySQL** installed and running
  - Check: Open MySQL Workbench or run `mysql --version`
  - If not installed, download from: https://dev.mysql.com/downloads/installer/

- ✅ **Text Editor** (VS Code recommended)
  - Download from: https://code.visualstudio.com/

## Step-by-Step Setup

### 1. Install Node.js (if not already installed)

See `INSTALL_NODEJS.md` for detailed instructions.

**Quick method:**
1. Go to https://nodejs.org/
2. Download LTS version
3. Run installer (accept defaults)
4. **Restart PowerShell/Command Prompt**
5. Verify: `node --version` and `npm --version`

### 2. Setup MySQL Database

**Option A: Using Command Line**
```powershell
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE sarms;

# Exit MySQL
EXIT;

# Import schema
mysql -u root -p sarms < database/schema.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create new database: `sarms`
4. Open `database/schema.sql`
5. Execute the entire script

### 3. Generate Password Hashes

```powershell
# Install dependencies first (this will also install bcryptjs)
npm install

# Generate password hashes
node scripts/generate-password-hash.js
```

Copy the SQL UPDATE statements and run them in MySQL:
```sql
USE sarms;
UPDATE users SET password = 'generated_hash_here' WHERE email = 'admin@sarms.com';
UPDATE users SET password = 'generated_hash_here' WHERE email = 'faculty@sarms.com';
UPDATE users SET password = 'generated_hash_here' WHERE email = 'student@sarms.com';
```

### 4. Create Environment File

Create a file named `.env` in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=sarms
PORT=3000
JWT_SECRET=my-super-secret-jwt-key-change-in-production
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

### 5. Install Project Dependencies

```powershell
npm install
```

This will install:
- express
- mysql2
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- body-parser

### 6. Start the Server

```powershell
npm start
```

You should see:
```
Connected to MySQL database
Server running on port 3000
```

### 7. Open in Browser

Open your browser and go to:
```
http://localhost:3000
```

## Login Credentials

After setting up password hashes:

- **Admin**: 
  - Email: `admin@sarms.com`
  - Password: `admin123`

- **Faculty**: 
  - Email: `faculty@sarms.com`
  - Password: `faculty123`

- **Student**: 
  - Email: `student@sarms.com`
  - Password: `student123`

## Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- See `INSTALL_NODEJS.md`
- **Restart PowerShell** after installing Node.js

### "Cannot connect to MySQL"
- Check if MySQL service is running
- Verify credentials in `.env` file
- Check if database `sarms` exists

### "Port 3000 already in use"
- Change PORT in `.env` file to another number (e.g., 3001)
- Or stop the application using port 3000

### "Password authentication failed"
- Make sure you updated password hashes in database
- Run `node scripts/generate-password-hash.js` again
- Update database with new hashes

## Development Mode

For auto-restart on file changes:
```powershell
npm run dev
```

(Requires nodemon, which will be installed with `npm install`)

## Need Help?

- Check `README.md` for detailed documentation
- Check `SETUP.md` for setup instructions
- Check `INSTALL_NODEJS.md` for Node.js installation help

