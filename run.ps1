# PowerShell script to start development servers

Write-Host "Starting Morpankh Saree Development Servers..." -ForegroundColor Cyan
Write-Host ""

# Check if .env files exist
if (-not (Test-Path "backend\.env")) {
    Write-Host "ERROR: backend\.env file not found!" -ForegroundColor Red
    Write-Host "Please create backend\.env file with your database configuration." -ForegroundColor Yellow
    Write-Host "See START.md for details." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "WARNING: frontend\.env.local not found. Creating default..." -ForegroundColor Yellow
    @"
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=
"@ | Out-File -FilePath "frontend\.env.local" -Encoding utf8
}

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Green
Write-Host "Backend will run on http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will run on http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

# Wait a bit
Start-Sleep -Seconds 3

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host ""
Write-Host "Servers are starting in separate windows..." -ForegroundColor Green
Write-Host "Opening browser in 5 seconds..." -ForegroundColor Yellow

Start-Sleep -Seconds 5

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Website opened in browser!" -ForegroundColor Green

