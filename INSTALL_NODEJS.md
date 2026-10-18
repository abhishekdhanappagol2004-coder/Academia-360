# Installing Node.js on Windows

## Option 1: Download and Install from Official Website (Recommended)

1. **Visit the Node.js official website:**
   - Go to: https://nodejs.org/
   - Download the **LTS (Long Term Support)** version (recommended for stability)

2. **Run the Installer:**
   - Double-click the downloaded `.msi` file (e.g., `node-v20.x.x-x64.msi`)
   - Click "Next" through the installation wizard
   - **IMPORTANT:** Make sure to check "Automatically install the necessary tools" if prompted
   - Click "Install" (you may need administrator privileges)
   - Wait for installation to complete

3. **Verify Installation:**
   - Close and reopen your PowerShell/Command Prompt
   - Run these commands to verify:
     ```powershell
     node --version
     npm --version
     ```
   - You should see version numbers (e.g., `v20.10.0` and `10.2.3`)

## Option 2: Install using Winget (Windows Package Manager)

If you have Windows 10/11 with winget:

```powershell
winget install OpenJS.NodeJS.LTS
```

Then restart your PowerShell/Command Prompt.

## Option 3: Install using Chocolatey (if you have it)

```powershell
choco install nodejs-lts
```

## Troubleshooting

### If node/npm is still not recognized after installation:

1. **Restart your terminal/PowerShell completely** (close and reopen)

2. **Check if Node.js is installed but not in PATH:**
   - Press `Win + R`
   - Type: `%AppData%\npm`
   - Check if npm is there
   - If yes, you need to add it to PATH manually

3. **Manually add to PATH (if needed):**
   - Press `Win + X` and select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\Program Files\nodejs\`
   - Click "OK" on all windows
   - Restart your terminal

4. **Verify installation location:**
   - Node.js is usually installed at: `C:\Program Files\nodejs\`
   - Check if `node.exe` and `npm.cmd` exist there

## After Installing Node.js

Once Node.js is installed, you can proceed with the project setup:

```powershell
# Navigate to your project directory
cd C:\Users\Shashank\OneDrive\Desktop\PROJECT

# Install project dependencies
npm install

# Start the server
npm start
```

## Quick Check Commands

Run these to verify everything is working:

```powershell
# Check Node.js version
node --version

# Check npm version  
npm --version

# Check npm global packages location
npm config get prefix
```

If you see version numbers, Node.js is successfully installed!

