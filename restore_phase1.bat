@echo off
echo.
echo =============================================
echo  PHASE 1 CHECKPOINT RESTORE SCRIPT
echo =============================================
echo.
echo This script will restore your project to Phase 1 checkpoint state.
echo WARNING: This will overwrite current files!
echo.
set /p confirm="Are you sure you want to restore Phase 1 checkpoint? (y/N): "
if /i not "%confirm%"=="y" (
    echo Restore cancelled.
    pause
    exit /b
)

echo.
echo Restoring Phase 1 checkpoint...
echo.

:: Navigate to project root
cd /d "%~dp0\..\.."

:: Backup current state before restore
echo Creating backup of current state...
if exist "checkpoints\pre-restore-backup" rmdir /s /q "checkpoints\pre-restore-backup"
mkdir "checkpoints\pre-restore-backup"

xcopy "backend" "checkpoints\pre-restore-backup\backend\" /s /e /i /y >nul 2>&1
xcopy "frontend" "checkpoints\pre-restore-backup\frontend\" /s /e /i /y >nul 2>&1
xcopy "public" "checkpoints\pre-restore-backup\public\" /s /e /i /y >nul 2>&1
copy "*.md" "checkpoints\pre-restore-backup\" >nul 2>&1
copy "*.json" "checkpoints\pre-restore-backup\" >nul 2>&1
copy "*.js" "checkpoints\pre-restore-backup\" >nul 2>&1
copy "*.bat" "checkpoints\pre-restore-backup\" >nul 2>&1

echo Backup of current state saved to: checkpoints\pre-restore-backup\

:: Restore from Phase 1
echo.
echo Restoring files from Phase 1 checkpoint...

:: Remove current directories
if exist "backend" rmdir /s /q "backend"
if exist "frontend" rmdir /s /q "frontend"
if exist "public" rmdir /s /q "public"

:: Restore directories
xcopy "checkpoints\phase1\backend" "backend\" /s /e /i /y >nul
xcopy "checkpoints\phase1\frontend" "frontend\" /s /e /i /y >nul
xcopy "checkpoints\phase1\public" "public\" /s /e /i /y >nul

:: Restore root files
copy "checkpoints\phase1\*.md" . >nul 2>&1
copy "checkpoints\phase1\*.json" . >nul 2>&1
copy "checkpoints\phase1\*.js" . >nul 2>&1
copy "checkpoints\phase1\*.bat" . >nul 2>&1

echo.
echo =============================================
echo  PHASE 1 CHECKPOINT RESTORED SUCCESSFULLY!
echo =============================================
echo.
echo Your project has been restored to Phase 1 state.
echo.
echo To start the servers:
echo 1. Backend: cd backend && npm run dev
echo 2. Frontend: cd frontend && npm start
echo.
echo Admin Access: http://localhost:3000/admin
echo Credentials: admin / admin123
echo.
echo Your previous state was backed up to:
echo checkpoints\pre-restore-backup\
echo.
pause
