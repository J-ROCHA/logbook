@echo off
REM Quick Start Script for Logbook Electron App - Windows Version

echo ================================================
echo   Logbook Desktop App - Quick Start
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo √ Node.js %NODE_VERSION% detected
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo X package.json not found!
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo X Failed to install dependencies
        pause
        exit /b 1
    )
    echo √ Dependencies installed successfully
    echo.
) else (
    echo √ Dependencies already installed
    echo.
)

REM Verify critical files exist
echo Verifying installation...
if exist "main.js" (echo √ main.js found) else (echo X main.js missing! & pause & exit /b 1)
if exist "preload.js" (echo √ preload.js found) else (echo X preload.js missing! & pause & exit /b 1)
if exist "database.js" (echo √ database.js found) else (echo X database.js missing! & pause & exit /b 1)
echo.

REM Run database tests
echo Running database tests...
node test-database.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo X Tests failed!
    pause
    exit /b 1
)
echo.
echo √ All tests passed!
echo.

echo ================================================
echo   Installation Complete!
echo ================================================
echo.
echo To start the application, run:
echo.
echo   npm start
echo.
echo To build for distribution:
echo.
echo   npm run build        # Current platform
echo   npm run build:mac    # macOS
echo   npm run build:win    # Windows
echo   npm run build:linux  # Linux
echo.
echo For more information, see README.md or INSTALL.md
echo ================================================
pause
