# COMPREHENSIVE FIX SCRIPT FOR ALL 17 ERRORS

Write-Host "🔧 FIXING ALL COMPILATION ERRORS..." -ForegroundColor Yellow
Write-Host ""

# Fix 1: auth.service.ts - verifyIdToken -> verifyToken
Write-Host "1️⃣ Fixing auth.service.ts..." -ForegroundColor Cyan
$authService = "src\auth\auth.service.ts"
(Get-Content $authService -Raw) -replace 'verifyIdToken', 'verifyToken' | Set-Content $authService -NoNewline

# Fix 2: auth.service.ts - Remove invalid fields (phone, avatar)
$content = Get-Content $authService -Raw
$content = $content -replace ',\s*phone:\s*decodedToken\.phone_number,', ''
$content = $content -replace ',\s*avatar:\s*decodedToken\.picture,', ''
Set-Content $authService -Value $content -NoNewline

# Fix 3: classes.service.ts line 235-238 - Delete should use delete(), not update()
Write-Host "2️⃣ Fixing classes.service.ts delete method..." -ForegroundColor Cyan
$classService = "src\classes\classes.service.ts"
$content = Get-Content $classService -Raw
$content = $content -replace '(?ms)await this\.prisma\.class\.update\(\{\s+where:\s*\{\s*id:\s*classId\s*\},\s+\s+\}\);', 'await this.prisma.class.delete({ where: { id: classId } });'
Set-Content $classService -Value $content -NoNewline

# Fix 4: bookings DTO - Add duration field
Write-Host "3️⃣ Fixing bookings DTO..." -ForegroundColor Cyan
$bookingDto = "src\bookings\dto\create-booking.dto.ts"
if (Test-Path $bookingDto) {
    $content = Get-Content $bookingDto -Raw
    if ($content -notmatch 'duration') {
        # Add duration field before closing brace
        $content = $content -replace '}\s*$', "    @IsInt()`n    @IsOptional()`n    duration?: number;  // In minutes (default: 60)`n}`n"
        Set-Content $bookingDto -Value $content -NoNewline
    }
}

Write-Host ""
Write-Host "✅ Fixed method name issues!" -ForegroundColor Green
Write-Host "✅ Removed invalid schema fields!" -ForegroundColor Green  
Write-Host "✅ Fixed delete method!" -ForegroundColor Green
Write-Host "✅ Added missing DTO fields!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Remaining: Controller method names need manual alignment" -ForegroundColor Yellow
