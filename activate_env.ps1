# PowerShell script to activate virtual environment
Write-Host "Activating Python virtual environment..." -ForegroundColor Green
& .\venv\Scripts\Activate.ps1
Write-Host ""
Write-Host "Virtual environment activated!" -ForegroundColor Green
Write-Host "You can now run: python app.py" -ForegroundColor Yellow
Write-Host ""

