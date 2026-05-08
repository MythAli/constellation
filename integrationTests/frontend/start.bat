@echo off
:: Move to the script's directory
cd /d "%~dp0"

echo Starting Cypress for React App (Frontend) Integration Tests...
call npm run cypress:open

pause