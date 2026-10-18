# How to Edit .env File

## ✅ .env File Created!

The `.env` file has been created in your project directory.

## ⚠️ IMPORTANT: Update MySQL Password

You need to replace `your_mysql_password_here` with your actual MySQL root password.

## Method 1: Edit with Notepad (Easiest)

**The .env file should have opened in Notepad.**

**In the file, find this line:**
```
DB_PASSWORD=your_mysql_password_here
```

**Replace `your_mysql_password_here` with your actual MySQL password.**

**Example:**
- If your MySQL password is `root123`, change it to:
  ```
  DB_PASSWORD=root123
  ```

**Save the file (Ctrl+S) and close Notepad.**

---

## Method 2: Edit with PowerShell

**Replace `YOUR_PASSWORD` with your actual MySQL password:**

```powershell
(Get-Content .env) -replace 'your_mysql_password_here', 'YOUR_PASSWORD' | Set-Content .env
```

**Example:**
```powershell
(Get-Content .env) -replace 'your_mysql_password_here', 'root123' | Set-Content .env
```

---

## Method 3: Edit with VS Code or Any Text Editor

1. **Open VS Code** or any text editor
2. **Open file:** `.env` in the project directory
3. **Find line:** `DB_PASSWORD=your_mysql_password_here`
4. **Replace** with your actual password
5. **Save** (Ctrl+S)

---

## Verify .env File

**After editing, verify the password is correct:**

```powershell
Get-Content .env
```

**You should see your actual password (not `your_mysql_password_here`):**
```
DB_PASSWORD=your_actual_password
```

---

## After Editing

Once you've updated the password, start the server:

```powershell
npm start
```

---

## Current .env Content

The file currently contains:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here  ← CHANGE THIS!
DB_NAME=sarms
PORT=3000
JWT_SECRET=
```

**Remember:** Only change the `DB_PASSWORD` value. Keep everything else the same!

