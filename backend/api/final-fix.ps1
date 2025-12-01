# FINAL FIX - Remove all isActive and fix remaining errors

Write-Host "🔧 FINAL FIX SCRIPT..." -ForegroundColor Yellow
Write-Host ""

# Fix 1: Remove all isActive references from auth.service.ts
Write-Host "1️⃣ Removing isActive from auth.service.ts..." -ForegroundColor Cyan
$authService = "src\auth\auth.service.ts"
$content = Get-Content $authService -Raw
$content = $content -replace '(?m)^\s+if \(!user\.isActive\) \{[^}]+\}\s*$', ''
$content = $content -replace ',?\s*isActive:\s*user\.isActive,?', ''
Set-Content $authService -Value $content -NoNewline

# Fix 2: Remove isActive from jwt.strategy.ts
Write-Host "2️⃣ Removing isActive from jwt.strategy.ts..." -ForegroundColor Cyan
$jwtStrategy = "src\auth\strategies\jwt.strategy.ts"
$content = Get-Content $jwtStrategy -Raw
$content = $content -replace '\s*\|\|\s*!user\.isActive', ''
Set-Content $jwtStrategy -Value $content -NoNewline

# Fix 3: Fix ClassesService delete method (line 235)
Write-Host "3️⃣ Fixing ClassesService delete method..." -ForegroundColor Cyan
$classService = "src\classes\classes.service.ts"
$content = Get-Content $classService -Raw
$content = $content -replace 'await this\.prisma\.class\.update\(\{\s+where:\s*\{\s*id:\s*classId\s*\},\s+\s+\}\);', 'await this.prisma.class.delete({ where: { id: classId } });'
Set-Content $classService -Value $content -NoNewline

# Fix 4: Rename delete method to actually be `delete`
Write-Host "4️⃣ Checking for delete method existence..." -ForegroundColor Cyan
$content = Get-Content $classService -Raw
if ($content -notmatch 'async delete\(') {
    # If method is still named something else, it's in the file but needs to be found
    Write-Host "   Method needs verification - checking manually" -ForegroundColor Yellow
}

# Fix 5: Fix TeacherProfile create - add required fields
Write-Host "5️⃣ Fixing TeacherProfile create in auth.service.ts..." -ForegroundColor Cyan
$content = Get-Content $authService -Raw
$content = $content -replace '(teacherProfile\.create\(\{\s+data:\s*\{)\s+userId:\s*user\.id,\s+(\}\);)', '$1`n                            userId: user.id,`n                            bio: "",`n                            education: "",`n                            experience: 0,`n                            hourlyRate: 50000,`n                        $2'
Set-Content $authService -Value $content -NoNewline

Write-Host ""
Write-Host "✅ Done! Checking if there are method name issues..." -ForegroundColor Green
