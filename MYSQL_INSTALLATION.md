# MySQL Installation Guide for Windows

## Official MySQL Downloads

### Option 1: MySQL Installer (Recommended for Windows)

**Direct Download Link:**
- **MySQL Installer for Windows (Full Installer):**
  - https://dev.mysql.com/downloads/installer/
  - Choose the **full installer** (larger file, ~400MB) - includes MySQL Server and tools
  - Or choose the **web installer** (smaller file, downloads components during installation)

**What to Download:**
- Look for: **mysql-installer-community-X.X.X.X.msi**
- Choose the **full installer** or **web installer**
- The full installer is easier (includes everything)

### Option 2: MySQL Community Server (Server Only)

**Direct Download Link:**
- https://dev.mysql.com/downloads/mysql/
- Click "Download" button for MySQL Community Server
- Choose "Windows (x86, 64-bit), MSI Installer"
- You can also download just the server without the installer

### Option 3: MySQL via XAMPP/WAMP (Easier Setup)

**XAMPP** (includes MySQL, Apache, PHP):
- https://www.apachefriends.org/download.html
- Download XAMPP for Windows
- Includes MySQL server + MySQL Workbench

**WAMP** (Windows, Apache, MySQL, PHP):
- https://www.wampserver.com/en/download-wampserver-64bits/
- Download WAMP Server

## Installation Steps

### Using MySQL Installer (Recommended)

1. **Download the MySQL Installer**
   - Go to: https://dev.mysql.com/downloads/installer/
   - Download the **full installer** (mysql-installer-community-8.0.X.X.msi)

2. **Run the Installer**
   - Double-click the downloaded `.msi` file
   - Choose "Full" or "Developer Default" installation type
   - Click "Next" through the wizard

3. **Set Root Password**
   - **IMPORTANT:** Set a root password (remember this!)
   - You'll need this password for your `.env` file
   - Example: `root123` or create your own secure password

4. **Configure MySQL Server**
   - Keep default settings (Port 3306)
   - Click "Next" through remaining steps
   - Click "Execute" to install
   - Wait for installation to complete

5. **Install MySQL Workbench** (if not already included)
   - MySQL Workbench is included in the installer
   - Or download separately: https://dev.mysql.com/downloads/workbench/

6. **Verify Installation**
   - Open MySQL Workbench
   - You should see "Local instance MySQL80" connection
   - Test connection with your root password

### Using XAMPP (Easier Alternative)

1. **Download XAMPP**
   - Go to: https://www.apachefriends.org/download.html
   - Download XAMPP for Windows

2. **Install XAMPP**
   - Run the installer
   - Install to default location (C:\xampp)
   - Start MySQL service from XAMPP Control Panel

3. **Access MySQL**
   - Default root password is empty (blank)
   - Or use phpMyAdmin at: http://localhost/phpmyadmin
   - Or use MySQL Workbench (install separately)

## Quick Links Summary

- **MySQL Installer (Recommended):**
  - https://dev.mysql.com/downloads/installer/
  - Choose: **mysql-installer-community-8.0.X.X.msi** (Full Installer)

- **MySQL Workbench (GUI Tool):**
  - https://dev.mysql.com/downloads/workbench/
  - Download the Windows installer

- **XAMPP (All-in-one):**
  - https://www.apachefriends.org/download.html

## After Installation

### Verify MySQL is Running

**Check MySQL Service:**
1. Press `Win + R`
2. Type: `services.msc`
3. Look for "MySQL80" or "MySQL"
4. Status should be "Running"

### Test MySQL Connection

**Using MySQL Workbench:**
- Open MySQL Workbench
- Click on "Local instance MySQL80"
- Enter root password
- Click "OK"

**Using Command Line (if MySQL is in PATH):**
```powershell
mysql -u root -p
```
Enter your root password.

### Add MySQL to PATH (Optional)

If you want to use `mysql` command from anywhere:

1. Find MySQL installation:
   - Usually: `C:\Program Files\MySQL\MySQL Server 8.0\bin\`
   
2. Add to PATH:
   - Press `Win + X` > System
   - Advanced system settings
   - Environment Variables
   - Under "System variables", find "Path"
   - Click "Edit" > "New"
   - Add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
   - Click "OK" on all windows
   - **Restart PowerShell**

## Next Steps After MySQL Installation

1. **Create the database:**
   ```sql
   CREATE DATABASE sarms;
   ```

2. **Import the schema:**
   - Open MySQL Workbench
   - Open `database\schema.sql` file
   - Execute the script

3. **Update password hashes** (already generated)

4. **Create .env file** with your MySQL root password

5. **Start the server:**
   ```powershell
   npm start
   ```

## Troubleshooting

### MySQL Service Won't Start
- Check if port 3306 is in use
- Run MySQL Installer > Reconfigure Server
- Check Windows Firewall settings

### Can't Connect to MySQL
- Verify service is running (services.msc)
- Check root password is correct
- Try resetting password via MySQL Installer

### MySQL Not in PATH
- Use full path: `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"`
- Or add MySQL bin folder to PATH (see above)

