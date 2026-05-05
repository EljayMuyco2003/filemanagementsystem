@echo off
echo =========================================
echo Starting File Management Portal Frontend
echo =========================================
echo.

cd client

echo Installing dependencies (if needed)...
if not exist node_modules (
    echo Installing npm packages...
    call npm install
)

echo Starting Angular development server...
echo.
echo Frontend will be available at: http://localhost:4200
echo.
call npm start
