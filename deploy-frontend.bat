@echo off
REM Frontend Build & Deployment Script for Windows

echo Building frontend for production...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    exit /b 1
)

echo.
echo Build successful! 
echo Output directory: build/
echo.
echo Next steps:
echo 1. Deploy the 'build' folder to your web server
echo 2. Configure your web server to serve index.html for all routes (SPA routing)
echo 3. Update REACT_APP_API_URL in environment to point to your backend
echo.
echo Example deployment commands:
echo   AWS S3: aws s3 sync build/ s3://your-bucket-name/
echo   Netlify: npm install -g netlify-cli ^&^& netlify deploy --prod --dir=build
echo   Docker: docker build -t paf-frontend . ^&^& docker run -p 80:80 paf-frontend
