# Moving your Project to WSL (Windows Subsystem for Linux)

Moving your project to the native WSL filesystem (e.g., Ubuntu) significantly improves performance (especially for `npm install` and Docker) compared to keeping it on the Windows drive (`/mnt/c` or `/mnt/e`).

## 1. Install a Linux Distribution (if not already done)
If you don't have a distro like Ubuntu yet, run this in PowerShell:
```powershell
wsl --install -d Ubuntu
```
*Restart your computer if prompted.*

## 2. Open your Linux Terminal
Search for **Ubuntu** in your Start menu and open it. Create a directory for your projects:
```bash
mkdir -p ~/projects
cd ~/projects
```

## 3. Clone or Move your Project
The best way is to clone it directly from GitHub inside WSL:
```bash
git clone https://github.com/Nathan-Mrx/Portfolio.git
cd Portfolio
```

**Alternatively**, if you want to copy files from your E: drive:
```bash
cp -r /mnt/e/GitHub/Portfolio .
```

## 4. Open in VS Code
Inside the Linux terminal, run:
```bash
code .
```
*This will prompt you to install the **WSL extension** in VS Code. Once installed, VS Code will run "inside" Linux.*

## 5. Re-initialize the project
Since WSL is a fresh environment:
1.  **Frontend**: `cd frontend && npm install`
2.  **Backend**: `cd ../backend && composer install` (ensure PHP and Composer are installed in WSL)
3.  **Docker**: Run `docker-compose up -d` (Docker Desktop for Windows works seamlessly with WSL).

> [!TIP]
> **Performance**: Always keep your files in the Linux home directory (`~/`) rather than `/mnt/c/Users/...` to avoid the cross-filesystem overhead.
