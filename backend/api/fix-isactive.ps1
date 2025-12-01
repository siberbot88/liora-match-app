# Fix isActive field errors
# This script removes all references to isActive field which doesn't exist in schema

$files = @(
    "src\classes\classes.service.ts",
    "src\classes\dto\update-class.dto.ts",
    "src\users\users.service.ts",
    "src\students\students.service.ts"
)

Write-Host "Fixing isActive references..." -ForegroundColor Yellow

foreach ($file in $files) {
    $fullPath = Join-Path "e:\liora\backend\api" $file
    
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        
        # Remove isActive: true lines
        $content = $content -replace '(?m)^\s+isActive:\s*true,\s*$', ''
        
        # Remove where: { isActive: true } blocks
        $content = $content -replace '(?m)\s*where:\s*{\s*isActive:\s*true\s*},?\s*', ''
        
        # Remove isActive checks
        $content = $content -replace '(?m)if\s*\(!.*\.isActive\)\s*{[^}]*}', ''
        
        # Remove data: { isActive: false }
        $content = $content -replace '(?m)data:\s*{\s*isActive:\s*false\s*},?', ''
        
        # Remove isActive? from DTOs
        $content = $content -replace '(?m)^\s+isActive\?:\s*boolean;\s*$', ''
        
        Set-Content $fullPath -Value $content -NoNewline
        Write-Host "✅ Fixed: $file" -ForegroundColor Green
    }
}

Write-Host "`n✅ Done! Run 'npm run build' to verify." -ForegroundColor Green
