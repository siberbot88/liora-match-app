# Liora Backend Setup Script
# Run this script to complete backend setup

Write-Host "🚀 Starting Liora Backend Setup..." -ForegroundColor Cyan

# Step 1: Clean previous installation
Write-Host "`n📦 Step 1: Cleaning previous installation..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
    Write-Host "   ✅ node_modules removed" -ForegroundColor Green
}
if (Test-Path "pnpm-lock.yaml") {
    Remove-Item -Force pnpm-lock.yaml
    Write-Host "   ✅ pnpm-lock.yaml removed" -ForegroundColor Green
}

# Step 2: Install dependencies with npm (more stable than pnpm for Windows)
Write-Host "`n📦 Step 2: Installing dependencies with npm..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 3: Generate Prisma Client
Write-Host "`n🔧 Step 3: Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Prisma Client generated!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Prisma generate failed (will retry during migration)" -ForegroundColor Yellow
}

# Step 4: Run database migrations
Write-Host "`n🗄️  Step 4: Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Database migrations completed!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Migration failed - check MySQL is running" -ForegroundColor Yellow
}

# Step 5: Verify setup
Write-Host "`n✅ Setup complete! Next steps:" -ForegroundColor Cyan
Write-Host "   1. Ensure MySQL is running" -ForegroundColor White
Write-Host "   2. Ensure Redis is running" -ForegroundColor White
Write-Host "   3. Run: npm run start:dev" -ForegroundColor White
Write-Host "`n🚀 Ready to start backend!" -ForegroundColor Green
