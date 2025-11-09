# PowerShell script to run the Flask app
Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting Agricultural AI Platform" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Activate virtual environment
& .\venv\Scripts\Activate.ps1

# Run the application
python run_app.py

