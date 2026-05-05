@echo off
echo ========================================
echo Database Setup for File Management Portal
echo ========================================
echo.

echo This script will help you set up the PostgreSQL database
echo.
echo Prerequisites:
echo 1. PostgreSQL must be installed
echo 2. You must know your PostgreSQL username and password
echo.
pause

echo.
echo Step 1: Creating database...
echo Run this command in your PostgreSQL terminal:
echo.
echo   createdb file_management_db
echo.
echo Or using psql:
echo   CREATE DATABASE file_management_db;
echo.
pause

echo.
echo Step 2: Running schema...
echo Run this command:
echo.
echo   psql -d file_management_db -f database/schema.sql
echo.
pause

echo.
echo Step 3: Generating password hashes...
cd server
node generate-hash.js
echo.
echo Copy the hashes above and update database/seed.sql
pause

echo.
echo Step 4: Running seed data...
echo After updating seed.sql, run:
echo.
echo   psql -d file_management_db -f database/seed.sql
echo.
pause

echo.
echo Step 5: Configure .env file...
echo Copy server/.env.example to server/.env
echo Then edit it with your database credentials
echo.
copy server\.env.example server\.env
echo .env file created! Please edit it now.
pause

echo.
echo ========================================
echo Database setup instructions complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit server/.env with your PostgreSQL credentials
echo 2. Run START_BACKEND.bat to start the backend
echo 3. Run START_FRONTEND.bat to start the frontend
echo.
pause
