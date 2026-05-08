@echo off
:: Move to the script's directory
cd /d "%~dp0"

echo Starting Jest for Express App (Backend) Unit Tests...
call npm test

pause