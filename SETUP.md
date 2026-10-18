# Quick Setup Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Setup Database

1. **Create MySQL Database:**
```bash
mysql -u root -p
```
Then in MySQL:
```sql
CREATE DATABASE sarms;
EXIT;
```

2. **Import Schema:**
```bash
mysql -u root -p sarms < database/schema.sql
```

## Step 3: Generate Password Hashes

Run the password hash generator:
```bash
node scripts/generate-password-hash.js
```

This will output SQL statements. Copy and run them in MySQL:
```sql
USE sarms;
UPDATE users SET password = 'generated_hash_here' WHERE email = 'admin@sarms.com';
UPDATE users SET password = 'generated_hash_here' WHERE email = 'faculty@sarms.com';
UPDATE users SET password = 'generated_hash_here' WHERE email = 'student@sarms.com';
```

## Step 4: Configure Environment

Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sarms
PORT=3000
JWT_SECRET=
```

## Step 5: Start Server

```bash
npm start
```

The application will be available at: `http://localhost:3000`

## Login Credentials

- **Admin**: admin@sarms.com / admin123
- **Faculty**: faculty@sarms.com / faculty123
- **Student**: student@sarms.com / student123

## Troubleshooting

### Database Connection Error
- Check MySQL is running: `mysqladmin -u root -p status`
- Verify credentials in `.env` file
- Ensure `sarms` database exists

### Password Not Working
- Make sure you've updated password hashes in the database
- Verify the hash generator script ran successfully
- Check database with: `SELECT email, password FROM users;`

### Port Already in Use
- Change PORT in `.env` file
- Or kill process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)

