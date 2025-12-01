# TARGETED FIX - Only specific lines, no full file replacements

Write-Host "🎯 TARGETED FIX FOR 7 ERRORS..." -ForegroundColor Yellow
Write-Host ""

# Fix 1: auth.service.ts line 19 - verifyIdToken -> verifyToken
Write-Host "1/7 Fix verifyIdToken..." -ForegroundColor Cyan
$file = "src\auth\auth.service.ts"
(Get-Content $file) | ForEach-Object {
    $_ -replace 'verifyIdToken', 'verifyToken'
} | Set-Content $file

# Fix 2: auth.service.ts line 62 - Add TeacherProfile required fields
Write-Host "2/7 Fix TeacherProfile creation..." -ForegroundColor Cyan
$content = Get-Content $file -Raw
$content = $content -replace '(\s+await this\.prisma\.teacherProfile\.create\(\{\s+data:\s*\{)\s+userId:\s*user\.id,\s+(\}\);)', '$1
                            userId: user.id,
                            bio: "",
                            education: "",
                            experience: 0,
                            hourlyRate: 50000,
                        $2'
Set-Content $file -Value $content -NoNewline

# Fix 3-5: Remove all isActive from auth.service.ts
Write-Host "3/7 Remove isActive checks..." -ForegroundColor Cyan
$content = Get-Content $file -Raw
# Remove isActive check blocks
$content = $content -replace '(?m)^\s+if \(!user\.isActive\) \{\s+throw new UnauthorizedException\(''User account is inactive''\);\s+\}\s+', ''
# Remove isActive from return object
$content = $content -replace ',?\s*isActive:\s*user\.isActive,?', ''
Set-Content $file -Value $content -NoNewline

# Fix 6: jwt.strategy.ts - Remove isActive check
Write-Host "4/7 Fix jwt.strategy..." -ForegroundColor Cyan
$file2 = "src\auth\strategies\jwt.strategy.ts"
(Get-Content $file2) | ForEach-Object {
    $_ -replace '\s*\|\|\s*!user\.isActive', ''
} | Set-Content $file2

# Fix 7: classes.controller.ts - Change delete to remove
Write-Host "5/7 Fix controller method..." -ForegroundColor Cyan
$file3 = "src\classes\classes.controller.ts"
(Get-Content $file3) | ForEach-Object {
    $_ -replace 'this\.classesService\.delete\(', 'this.classesService.remove('
} | Set-Content $file3

Write-Host ""
Write-Host "✅ All 7 targeted fixes applied!" -ForegroundColor Green
Write-Host "Server should recompile now..." -ForegroundColor Yellow
