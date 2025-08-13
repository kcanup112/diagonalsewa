@echo off
echo Restoring original theme from checkpoint...
xcopy /E /Y "checkpoints\original\*" "frontend\"
echo Original theme restored successfully!
echo You may need to restart your development server.
pause
