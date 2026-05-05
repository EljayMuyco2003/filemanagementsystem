@echo off
echo ========================================
echo   PostgreSQL Database Setup
echo ========================================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL is NOT installed!
    echo.
    echo Please install PostgreSQL first:
    echo 1. Download from: https://www.postgresql.org/download/windows/
    echo 2. Install PostgreSQL 16
    echo 3. Remember your postgres password
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo [OK] PostgreSQL is installed
echo.

REM Prompt for password
set /p PGPASSWORD="Enter your PostgreSQL password: "
echo.

echo [1/3] Creating database 'file_portal'...
createdb -U postgres file_portal 2>nul
if %errorlevel% equ 0 (
    echo [OK] Database created
) else (
    echo [INFO] Database already exists
)
echo.

echo [2/3] Loading schema (creating tables)...
psql -U postgres -d file_portal -f database\schema.sql
if %errorlevel% neq 0 (
    echo [ERROR] Failed to load schema
    pause
    exit /b 1
)
echo [OK] Tables created
echo.

echo [3/3] Loading seed data (default users)...
psql -U postgres -d file_portal -f database\seed.sql
if %errorlevel% neq 0 (
    echo [ERROR] Failed to load seed data
    pause
    exit /b 1
)
echo [OK] Seed data loaded
echo.

echo ========================================
echo   SUCCESS! Database is ready!
echo ========================================
echo.
echo Tables created:
echo   - users
echo   - profiles
echo   - uploaded_files
echo   - templates
echo.
echo Default accounts:
echo   Admin: admin@portal.com / Admin@1234
echo   User:  user@portal.com / User@1234
echo.
echo IMPORTANT: Update server/.env with your password:
echo   DATABASE_URL=postgresql://postgres:%PGPASSWORD%@localhost:5432/file_portal
echo.
pause
