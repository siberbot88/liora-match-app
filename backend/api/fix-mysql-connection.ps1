# Script untuk fix MySQL connection error
Write-Host "🔍 Troubleshooting MySQL Connection..." -ForegroundColor Cyan

# Check 1: Apakah MySQL running?
Write-Host "`n1️⃣ Checking MySQL Status..." -ForegroundColor Yellow

$mysqlProcess = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
if ($mysqlProcess) {
    Write-Host "   ✅ MySQL process found (PID: $($mysqlProcess.Id))" -ForegroundColor Green
}
else {
    Write-Host "   ❌ MySQL is NOT running!" -ForegroundColor Red
    Write-Host "   💡 Solutions:" -ForegroundColor Yellow
    Write-Host "      - If using XAMPP: Buka XAMPP Control Panel → Start MySQL" -ForegroundColor White
    Write-Host "      - If using standalone: Start MySQL service" -ForegroundColor White
    Write-Host "" 
    Write-Host "   ⚠️  Please start MySQL first, then run this script again" -ForegroundColor Yellow
    exit 1
}

# Check 2: Test different password combinations
Write-Host "`n2️⃣ Testing MySQL Connection..." -ForegroundColor Yellow

# Backup current .env
if (Test-Path ".env") {
    Copy-Item ".env" ".env.backup" -Force
    Write-Host "   ✅ Backed up .env to .env.backup" -ForegroundColor Green
}

# Test 1: No password (XAMPP default)
Write-Host "   Testing: No password (XAMPP default)..." -ForegroundColor White
$env:DATABASE_URL = "mysql://root:@localhost:3306/liora"
$testResult1 = npx prisma db execute --stdin --schema=./prisma/schema.prisma 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Success! MySQL has NO PASSWORD" -ForegroundColor Green
    $correctUrl = "mysql://root:@localhost:3306/liora"
    $passwordType = "No Password (Empty)"
}
else {
    Write-Host "   ❌ Failed with no password" -ForegroundColor Red
    
    # Test 2: Common passwords
    $commonPasswords = @("", "root", "password", "admin", "mysql", "123456")
    $correctUrl = $null
    
    foreach ($pwd in $commonPasswords) {
        if ($pwd -eq "") { continue }
        Write-Host "   Testing password: $pwd" -ForegroundColor White
        $testUrl = "mysql://root:$pwd@localhost:3306/liora"
        $env:DATABASE_URL = $testUrl
        $testResult = npx prisma db execute --stdin --schema=./prisma/schema.prisma 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Success! Password is: $pwd" -ForegroundColor Green
            $correctUrl = $testUrl
            $passwordType = $pwd
            break
        }
    }
}

# Update .env file
if ($correctUrl) {
    Write-Host "`n3️⃣ Updating .env file..." -ForegroundColor Yellow
    
    $envContent = Get-Content ".env" -Raw
    $envContent = $envContent -replace 'DATABASE_URL="mysql://[^"]*"', "DATABASE_URL=`"$correctUrl`""
    Set-Content ".env" $envContent -NoNewline
    
    Write-Host "   ✅ .env updated successfully!" -ForegroundColor Green
    Write-Host "   Password type: $passwordType" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎉 MySQL connection configured!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   npx prisma migrate dev --name init" -ForegroundColor White
    Write-Host "   npm run start:dev" -ForegroundColor White
}
else {
    Write-Host "`n❌ Could not find correct password" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Manual steps:" -ForegroundColor Yellow
    Write-Host "   1. Open XAMPP/phpMyAdmin" -ForegroundColor White
    Write-Host "   2. Check MySQL password in config" -ForegroundColor White
    Write-Host "   3. Or reset MySQL password" -ForegroundColor White
    Write-Host ""
    Write-Host "   Then edit .env manually:" -ForegroundColor White
    Write-Host '   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/liora"' -ForegroundColor Gray
}
