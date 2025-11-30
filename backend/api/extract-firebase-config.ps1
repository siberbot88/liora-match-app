# Script untuk Extract Firebase Config dari google-services.json

param(
    [string]$JsonPath = "google-services.json"
)

if (-not (Test-Path $JsonPath)) {
    Write-Host "❌ File google-services.json tidak ditemukan!" -ForegroundColor Red
    Write-Host "💡 Download dulu dari Firebase Console" -ForegroundColor Yellow
    exit 1
}

Write-Host "📄 Reading google-services.json..." -ForegroundColor Cyan

$json = Get-Content $JsonPath -Raw | ConvertFrom-Json

$projectId = $json.project_info.project_id
$storageBucket = $json.project_info.storage_bucket
$apiKey = $json.client[0].api_key[0].current_key
$appId = $json.client[0].client_info.mobilesdk_app_id
$messagingSenderId = $json.project_info.project_number
$authDomain = "$projectId.firebaseapp.com"

Write-Host "`n✅ Firebase Config Extracted!" -ForegroundColor Green
Write-Host "`nCopy these values to mobile/.env:" -ForegroundColor Yellow
Write-Host ""
Write-Host "EXPO_PUBLIC_FIREBASE_API_KEY=$apiKey" -ForegroundColor White
Write-Host "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=$authDomain" -ForegroundColor White
Write-Host "EXPO_PUBLIC_FIREBASE_PROJECT_ID=$projectId" -ForegroundColor White
Write-Host "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=$storageBucket" -ForegroundColor White
Write-Host "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId" -ForegroundColor White
Write-Host "EXPO_PUBLIC_FIREBASE_APP_ID=$appId" -ForegroundColor White
Write-Host ""

# Auto-write to .env if exists
$envPath = "..\mobile\.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    $envContent = $envContent -replace 'EXPO_PUBLIC_FIREBASE_API_KEY=.*', "EXPO_PUBLIC_FIREBASE_API_KEY=$apiKey"
    $envContent = $envContent -replace 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=.*', "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=$authDomain"
    $envContent = $envContent -replace 'EXPO_PUBLIC_FIREBASE_PROJECT_ID=.*', "EXPO_PUBLIC_FIREBASE_PROJECT_ID=$projectId"
    $envContent = $envContent -replace 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=.*', "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=$storageBucket"
    $envContent = $envContent -replace 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=.*', "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId"
    $envContent = $envContent -replace 'EXPO_PUBLIC_FIREBASE_APP_ID=.*', "EXPO_PUBLIC_FIREBASE_APP_ID=$appId"
    
    Set-Content $envPath $envContent -NoNewline
    Write-Host "✅ .env file updated automatically!" -ForegroundColor Green
}
