@echo off
title IntelliGrade Auto-Sync to GitHub
echo Starting IntelliGrade Auto-Sync...
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0auto_sync.ps1"
pause
