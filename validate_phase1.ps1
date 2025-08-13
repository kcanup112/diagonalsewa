# Phase 1 Checkpoint Validation Script
# This script validates the integrity of the Phase 1 checkpoint

Write-Host ""
Write-Host "=============================================" -ForegroundColor Blue
Write-Host " PHASE 1 CHECKPOINT VALIDATION" -ForegroundColor Blue
Write-Host "=============================================" -ForegroundColor Blue
Write-Host ""

$checkpointPath = "checkpoints\phase1"

if (-not (Test-Path $checkpointPath)) {
    Write-Host "ERROR: Phase 1 checkpoint not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Validating checkpoint structure..." -ForegroundColor Cyan

# Check main directories
$requiredDirs = @("backend", "frontend", "public")
$missingDirs = @()

foreach ($dir in $requiredDirs) {
    $dirPath = Join-Path $checkpointPath $dir
    if (Test-Path $dirPath) {
        $fileCount = (Get-ChildItem -Path $dirPath -Recurse -File | Measure-Object).Count
        Write-Host "[OK] $dir directory: $fileCount files" -ForegroundColor Green
    } else {
        $missingDirs += $dir
        Write-Host "[MISSING] $dir directory" -ForegroundColor Red
    }
}

# Check critical files
$criticalFiles = @(
    "backend\server.js",
    "backend\routes\portfolios.js", 
    "frontend\src\components\admin\PortfolioManager.js",
    "frontend\src\components\Portfolio\PortfolioDisplay.js",
    "frontend\src\services\api.js",
    "frontend\package.json",
    "backend\package.json"
)

Write-Host ""
Write-Host "Validating critical files..." -ForegroundColor Cyan

$missingFiles = @()
foreach ($file in $criticalFiles) {
    $filePath = Join-Path $checkpointPath $file
    if (Test-Path $filePath) {
        $size = [math]::Round((Get-Item $filePath).Length / 1KB, 2)
        Write-Host "[OK] $file ($size KB)" -ForegroundColor Green
    } else {
        $missingFiles += $file
        Write-Host "[MISSING] $file" -ForegroundColor Red
    }
}

# Summary
Write-Host ""
Write-Host "=============================================" -ForegroundColor Blue
Write-Host " VALIDATION SUMMARY" -ForegroundColor Blue  
Write-Host "=============================================" -ForegroundColor Blue

$totalFiles = (Get-ChildItem -Path $checkpointPath -Recurse -File | Measure-Object).Count
$totalSize = (Get-ChildItem -Path $checkpointPath -Recurse -File | Measure-Object -Property Length -Sum).Sum
$sizeInMB = [math]::Round($totalSize / 1MB, 2)

Write-Host "Total files: $totalFiles" -ForegroundColor Cyan
Write-Host "Total size: $sizeInMB MB" -ForegroundColor Cyan

if ($missingDirs.Count -eq 0 -and $missingFiles.Count -eq 0) {
    Write-Host ""
    Write-Host "[SUCCESS] VALIDATION PASSED: Phase 1 checkpoint is complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Features included in this checkpoint:" -ForegroundColor Yellow
    Write-Host "  - Complete portfolio management system" -ForegroundColor White
    Write-Host "  - Multiple file upload functionality" -ForegroundColor White
    Write-Host "  - YouTube URL integration" -ForegroundColor White
    Write-Host "  - Admin dashboard with portfolio management" -ForegroundColor White
    Write-Host "  - PostgreSQL database with Sequelize ORM" -ForegroundColor White
    Write-Host "  - RESTful API endpoints" -ForegroundColor White
    Write-Host ""
    Write-Host "To restore this checkpoint:" -ForegroundColor Yellow
    Write-Host "  - Run: .\restore_phase1.bat (Windows)" -ForegroundColor White
    Write-Host "  - Or:  .\restore_phase1.ps1 (PowerShell)" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "[FAILED] VALIDATION FAILED!" -ForegroundColor Red
    if ($missingDirs.Count -gt 0) {
        Write-Host "Missing directories: $($missingDirs -join ', ')" -ForegroundColor Red
    }
    if ($missingFiles.Count -gt 0) {
        Write-Host "Missing files: $($missingFiles -join ', ')" -ForegroundColor Red
    }
}

Write-Host ""
