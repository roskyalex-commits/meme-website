@echo off
echo Starting MemeVote Development Server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Trying to start development server...
echo.

REM Try Vercel dev first
echo Option 1: Trying Vercel dev...
npm run dev
if %errorlevel% neq 0 (
    echo.
    echo Vercel failed, trying simple HTTP server...
    echo This will serve static files but API won't work
    echo.
    npm run dev:simple
)

echo.
echo Open http://localhost:3000 in your browser
echo Press Ctrl+C to stop the server
