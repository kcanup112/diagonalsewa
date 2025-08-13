# Portfolio Management System - Phase 1 Checkpoint
# PowerShell Restore Script

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host " PHASE 1 CHECKPOINT RESTORE SCRIPT" -ForegroundColor Green  
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "This script will restore your project to Phase 1 checkpoint state." -ForegroundColor Yellow
Write-Host "WARNING: This will overwrite current files!" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Are you sure you want to restore Phase 1 checkpoint? (y/N)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "Restore cancelled." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "Restoring Phase 1 checkpoint..." -ForegroundColor Green
Write-Host ""

# Navigate to project root
$scriptPath = $PSScriptRoot
$projectRoot = Split-Path -Parent -Path $scriptPath
Set-Location $projectRoot

# Backup current state before restore
Write-Host "Creating backup of current state..." -ForegroundColor Cyan
$backupPath = "checkpoints\pre-restore-backup"
if (Test-Path $backupPath) {
    Remove-Item -Recurse -Force $backupPath
}
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

# Backup current directories
if (Test-Path "backend") { Copy-Item -Path "backend" -Destination "$backupPath\backend" -Recurse -Force }
if (Test-Path "frontend") { Copy-Item -Path "frontend" -Destination "$backupPath\frontend" -Recurse -Force }
if (Test-Path "public") { Copy-Item -Path "public" -Destination "$backupPath\public" -Recurse -Force }

# Backup root files
Get-ChildItem -Path "." -Include "*.md", "*.json", "*.js", "*.bat" | Copy-Item -Destination $backupPath -Force

Write-Host "Backup of current state saved to: $backupPath" -ForegroundColor Green

# Restore from Phase 1
Write-Host ""
Write-Host "Restoring files from Phase 1 checkpoint..." -ForegroundColor Cyan

# Remove current directories
if (Test-Path "backend") { Remove-Item -Recurse -Force "backend" }
if (Test-Path "frontend") { Remove-Item -Recurse -Force "frontend" }  
if (Test-Path "public") { Remove-Item -Recurse -Force "public" }

# Restore directories
Copy-Item -Path "checkpoints\phase1\backend" -Destination "backend" -Recurse -Force
Copy-Item -Path "checkpoints\phase1\frontend" -Destination "frontend" -Recurse -Force
Copy-Item -Path "checkpoints\phase1\public" -Destination "public" -Recurse -Force

# Restore root files
Get-ChildItem -Path "checkpoints\phase1" -Include "*.md", "*.json", "*.js", "*.bat" | Copy-Item -Destination "." -Force

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host " PHASE 1 CHECKPOINT RESTORED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your project has been restored to Phase 1 state." -ForegroundColor Green
Write-Host ""
Write-Host "To start the servers:" -ForegroundColor Yellow
Write-Host "1. Backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "2. Frontend: cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "Admin Access: http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host "Credentials: admin / admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your previous state was backed up to:" -ForegroundColor Yellow
Write-Host "checkpoints\pre-restore-backup\" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
