# Commands to Run the Project

## ✅ Progress So Far:
- ✅ Node.js installed
- ✅ Dependencies installed (npm install)
- ✅ MySQL installed
- ✅ Database `sarms` created
- ✅ All tables created
- ✅ Password hashes updated

## 🔄 Final Steps to Run the Project:

### Step 1: Create .env File (IMPORTANT!)

**If you haven't created the .env file yet, create it now:**

**Location:** `C:\Users\Shashank\OneDrive\Desktop\PROJECT\.env`

**Content:** (Replace `your_mysql_password` with your actual MySQL root password)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=sarms
PORT=3000
JWT_SECRET=
```

**Example** (if your MySQL password is `root123`):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123
DB_NAME=sarms
PORT=3000
JWT_SECRET=
```

**Create the file using PowerShell:**
```powershell
@"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=sarms
PORT=3000
JWT_SECRET=
"@ | Out-File -FilePath .env -Encoding utf8
```

**Then edit the file and replace `your_mysql_password_here` with your actual password!**

---

### Step 2: Navigate to Project Directory

**Make sure you're in the project folder:**

```powershell
cd C:\Users\Shashank\OneDrive\Desktop\PROJECT
```

---

### Step 3: Verify .env File Exists

```powershell
Get-Content .env
```

**You should see your database configuration.**

---

### Step 4: Start the Server

**Run this command:**

```powershell
npm start
```

**You should see:**
```
Connected to MySQL database
Server running on port 3000
```

**If you see errors:**
- Check MySQL password in `.env` file is correct
- Make sure MySQL service is running
- Verify database `sarms` exists

---

### Step 5: Open in Browser

**Once the server is running, open your web browser and go to:**

```
http://localhost:3000
```

**You should see the login page! 🎉**

---

## 🎯 Complete Command Sequence

**Run these commands one by one in PowerShell:**

```powershell
# Step 1: Navigate to project directory
cd C:\Users\Shashank\OneDrive\Desktop\PROJECT

# Step 2: Check if .env exists
Get-Content .env

# Step 3: If .env doesn't exist, create it (replace password)
@"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=sarms
PORT=3000
JWT_SECRET=
"@ | Out-File -FilePath .env -Encoding utf8

# Step 4: Edit .env file to add your MySQL password
notepad .env

# Step 5: Start the server
npm start
```

**After server starts, open browser:**
```
http://localhost:3000
```

---

## 🔑 Login Credentials

After logging in, use these credentials:

- **Admin**: 
  - Email: `admin@sarms.com`
  - Password: `admin123`

- **Faculty**: 
  - Email: `faculty@sarms.com`
  - Password: `faculty123`

- **Student**: 
  - Email: `student@sarms.com`
  - Password: `student123`

---

## 🛑 Stop the Server

**To stop the server:**
- Press `Ctrl + C` in the PowerShell window where the server is running

---

## 🔄 Restart the Server

**After making changes:**

```powershell
# Stop server (Ctrl + C), then:
npm start
```

**Or use development mode with auto-reload:**

```powershell
npm run dev
```

---

## 📋 Quick Checklist:

- [ ] `.env` file created with correct MySQL password
- [ ] In project directory: `C:\Users\Shashank\OneDrive\Desktop\PROJECT`
- [ ] Server started: `npm start`
- [ ] See "Server running on port 3000" message
- [ ] Browser opened: http://localhost:3000
- [ ] Login page visible
- [ ] Can login with test credentials

---

## ❓ Troubleshooting

### "Cannot connect to MySQL"
**Error:** `Access denied for user 'root'@'localhost'`

**Fix:**
- Check MySQL password in `.env` file
- Verify MySQL service is running (Services > MySQL80)
- Test MySQL connection: `mysql -u root -p`

### "Error: connect ECONNREFUSED"
**Error:** Connection refused to database

**Fix:**
- Check MySQL service is running
- Verify `DB_HOST=localhost` and `DB_PORT=3306` (if needed)
- Make sure database `sarms` exists

### "ER_NOT_SUPPORTED_AUTH_MODE"
**Error:** Authentication method not supported

**Fix:**
- Run this in MySQL: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';`
- Then restart MySQL service

### Port 3000 Already in Use
**Error:** Port 3000 is already in use

**Fix:**
- Change PORT in `.env` file to another number (e.g., 3001, 8080)
- Or kill the process using port 3000:
  ```powershell
  netstat -ano | findstr :3000
  taskkill /PID <process_id> /F
  ```

### .env File Not Found
**Error:** Cannot find .env file

**Fix:**
- Make sure you're in the project directory
- Create `.env` file (see Step 1 above)
- Verify file name is exactly `.env` (not `.env.txt`)

---

## 🎉 Success!

Once everything is working:
- Server is running on port 3000
- You can access http://localhost:3000
- Login page is visible
- You can login with test credentials

**Your Student Academic Record Management System (SARMS) is now running!** 🚀

