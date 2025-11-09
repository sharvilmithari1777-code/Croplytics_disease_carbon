@echo off
title Agricultural AI Platform
color 0A
cls

echo.
echo ============================================================
echo     AGRICULTURAL AI PLATFORM - STARTING SERVER
echo ============================================================
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Please run: python -m venv venv
    echo Then install dependencies: pip install -r requirements.txt
    pause
    exit /b 1
)

REM Activate virtual environment
echo [1/3] Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment!
    pause
    exit /b 1
)

REM Check if app.py exists
if not exist "app.py" (
    echo ERROR: app.py not found!
    pause
    exit /b 1
)

echo [2/3] Virtual environment activated
echo [3/3] Starting Flask server...
echo.
echo ============================================================
echo     Server will start on: http://127.0.0.1:5000
echo     Press CTRL+C to stop the server
echo ============================================================
echo.

REM Run the application
python app.py

pause

