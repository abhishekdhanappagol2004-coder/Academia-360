# Fix "Invalid Credentials" Error

## Problem
Getting "Invalid credentials" error when trying to log in with:
- admin@sarms.com / admin123
- faculty@sarms.com / faculty123
- student@sarms.com / student123

## Root Cause
The password hashes in the database are still set to placeholder values (`PLACEHOLDER_UPDATE_WITH_BCRYPT_HASH`) instead of actual bcrypt hashes.

## Solution: Update Password Hashes in Database

### Step 1: Connect to MySQL

**In PowerShell:**
```powershell
mysql -u root -p sarms
```

*Or if MySQL not in PATH:*
```powershell
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p sarms
```

*Enter your MySQL root password*

---

### Step 2: Update Password Hashes

**Once you're in MySQL (`mysql>`), run these UPDATE queries:**

```sql
USE sarms;

UPDATE users SET password = '$2a$10$kU.UVOxYNwnZd6ptcEBLpuCnfLKdPnsVHFBMjI5ZNBUhQ0SuPfwza' WHERE email = 'admin@sarms.com';

UPDATE users SET password = '$2a$10$ssOP7YgsK5VbR4b/ENZ1w.DlFq0lniq/.ADk3lrq.ldvT86a6fWJm' WHERE email = 'faculty@sarms.com';

UPDATE users SET password = '$2a$10$riN.igcRjUOhXWvLjRJfw.iKkETHSXhhSpFAYFEI6SJuJ6E0gdtnu' WHERE email = 'student@sarms.com';
```

---

### Step 3: Verify Passwords Were Updated

```sql
SELECT id, email, role, password FROM users;
```

**You should see:**
- The password column should show the bcrypt hashes (starting with `$2a$10$...`)
- NOT `PLACEHOLDER_UPDATE_WITH_BCRYPT_HASH`

---

### Step 4: Exit MySQL

```sql
exit
```

---

### Step 5: Restart the Server

**Stop the current server** (Ctrl+C in the PowerShell window where server is running), then:

```powershell
npm start
```

---

### Step 6: Try Logging In Again

1. **Open browser:** http://localhost:3000
2. **Select role:** Admin
3. **Email:** admin@sarms.com
4. **Password:** admin123
5. **Click "Log In"**

---

## Alternative: Generate New Password Hashes

If the above doesn't work, generate new hashes:

**In PowerShell (in project directory):**
```powershell
node scripts\generate-password-hash.js
```

This will output new SQL UPDATE statements. Copy and run them in MySQL.

---

## Quick Check: Verify Current Passwords in Database

**To check what's currently in the database:**

```sql
SELECT email, role, LEFT(password, 30) as password_preview FROM users;
```

**If you see `PLACEHOLDER_UPDATE_WITH_BCRYPT_HASH`:**
- The passwords haven't been updated yet
- Run the UPDATE queries above

**If you see `$2a$10$...`:**
- Passwords are hashed correctly
- Check if .env file has correct MySQL password
- Verify database connection in server logs

---

## Troubleshooting

### Still Getting "Invalid credentials"?

1. **Check server console for errors:**
   - Look for database connection errors
   - Check if MySQL service is running

2. **Verify database connection:**
   - Check `.env` file has correct MySQL password
   - Test connection: `mysql -u root -p sarms`

3. **Verify users exist:**
   ```sql
   SELECT * FROM users;
   ```
   Should show 3 users.

4. **Check password format:**
   ```sql
   SELECT email, password FROM users WHERE email = 'admin@sarms.com';
   ```
   Should show bcrypt hash starting with `$2a$10$...`

5. **Try generating new hashes:**
   ```powershell
   node scripts\generate-password-hash.js
   ```
   Use the new hashes to update database.

---

## Expected Database State

After fixing, your `users` table should have:

| id | email | role | password |
|----|-------|------|----------|
| 1 | admin@sarms.com | admin | $2a$10$kU.UVOxYNwnZd6ptcEBLpu... |
| 2 | faculty@sarms.com | faculty | $2a$10$ssOP7YgsK5VbR4b/ENZ1w... |
| 3 | student@sarms.com | student | $2a$10$riN.igcRjUOhXWvLjRJfw... |

