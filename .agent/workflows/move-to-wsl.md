---
description: How to move the project to WSL
---

1. Open a PowerShell terminal.
2. Check if Ubuntu is installed: `wsl -l -v`.
3. If not, install it: `wsl --install -d Ubuntu`.
4. Open Ubuntu and create a folder: `mkdir -p ~/github && cd ~/github`.
5. Clone the project: `git clone https://github.com/Nathan-Mrx/Portfolio.git`.
6. Open with VS Code: `code .`.
