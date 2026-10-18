# Fix PowerShell Execution Policy Error

## Problem
You're seeing this error:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running 
scripts is disabled on this system.
```

## Solution: Change PowerShell Execution Policy

### Option 1: Run PowerShell as Administrator (Recommended)

1. **Close your current PowerShell window**

2. **Open PowerShell as Administrator:**
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
   - Or search for "PowerShell" in Start Menu
   - Right-click and select "Run as Administrator"

3. **Set the execution policy:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. **When prompted, type `Y` and press Enter**

5. **Verify it worked:**
   ```powershell
   Get-ExecutionPolicy
   ```
   Should show: `RemoteSigned`

6. **Close the Administrator PowerShell window**

7. **Open a regular PowerShell window** (not as admin)

8. **Test npm:**
   ```powershell
   npm --version
   ```

### Option 2: Change Policy for Current Session Only (Quick Test)

If you can't run as Administrator, try this in your current PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npm --version
```

**Note:** This only works for the current PowerShell session. You'll need to do Option 1 for a permanent fix.

### Option 3: Bypass for Single Command (Temporary)

You can also bypass the policy for a single command:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm --version"
```

But you'd need to do this for every npm command, which is tedious.

## After Fixing

Once the execution policy is fixed:

1. **Navigate to your project:**
   ```powershell
   cd C:\Users\Shashank\OneDrive\Desktop\PROJECT
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Continue with setup** (see NEXT_STEPS.md)

## What Each Policy Means

- **Restricted**: No scripts allowed (your current issue)
- **RemoteSigned**: Local scripts can run; downloaded scripts need to be signed
- **Unrestricted**: All scripts can run (less secure)
- **Bypass**: No restrictions (not recommended for security)

**RemoteSigned** is the recommended setting - it allows npm to work while maintaining security.

## Troubleshooting

### "Access Denied" Error
- Make sure you're running PowerShell **as Administrator**
- Right-click PowerShell icon > "Run as Administrator"

### Still Getting Error After Fix
- Close and reopen PowerShell completely
- Check the policy: `Get-ExecutionPolicy -List`
- Make sure CurrentUser scope shows RemoteSigned

### Want to Revert Later?
```powershell
Set-ExecutionPolicy -ExecutionPolicy Restricted -Scope CurrentUser
```

