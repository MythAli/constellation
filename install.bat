@echo off
:: Move to the script's directory
cd /d "%~dp0"

echo Starting installation for Constellation...

echo Installing Frontend dependencies...
cd frontend && call npm install && cd ..

echo Installing Backend dependencies...
cd backend && call npm install && cd ..

echo Installing Unit Tests...
cd unitTests\frontend && call npm install && cd ..\..
cd unitTests\backend && call npm install && cd ..\..

echo All dependencies installed successfully.
pause