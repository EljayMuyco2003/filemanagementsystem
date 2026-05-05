@echo off
echo ========================================
echo Starting File Management Portal Backend
echo ========================================
echo.

cd server

echo Checking if .env file exists...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and configure it
    echo.
    echo Run this command:
    echo copy .env.example .env
    echo.
    echo Then edit .env with your PostgreSQL credentials
    pause
    exit /b 1
)

echo Starting backend server...
npm run dev
