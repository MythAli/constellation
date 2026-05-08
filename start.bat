@echo off
:: Move to the script's directory
cd /d "%~dp0"

echo Launching Constellation Services...

:: Launch Backend in a new window
start "Constellation Backend" cmd /k "cd backend && npm start"

:: Launch Frontend in a new window
start "Constellation Frontend" cmd /k "cd frontend && npm start"

echo Servers are booting up in separate windows.
:: This window closes automatically since it reached the end of the script
exit