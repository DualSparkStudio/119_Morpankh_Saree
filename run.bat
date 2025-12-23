@echo off
echo Starting Morpankh Saree Development Servers...
echo.

echo Checking if database is configured...
if not exist "backend\.env" (
    echo ERROR: backend\.env file not found!
    echo Please create backend\.env file with your database configuration.
    echo See START.md for details.
    pause
    exit /b 1
)

if not exist "frontend\.env.local" (
    echo WARNING: frontend\.env.local not found. Creating default...
    echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > frontend\.env.local
    echo NEXT_PUBLIC_RAZORPAY_KEY_ID= >> frontend\.env.local
)

echo.
echo Starting servers...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting in separate windows...
echo Press any key to open the website in your browser...
pause >nul

start http://localhost:3000

