@echo off
echo Installing NextBeer Admin Dashboard...
echo.

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Starting development server...
echo The application will be available at http://localhost:5173
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.

call npm run dev

pause
