@echo off
REM Backend Build & Deployment Script for Windows

echo Building backend for production...
cd backend

call mvn clean package -DskipTests

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    cd ..
    exit /b 1
)

echo.
echo Build successful!
echo JAR file: backend/target/paf-backend-0.0.1-SNAPSHOT.jar
echo.
echo Next steps:
echo 1. Run: java -jar target/paf-backend-0.0.1-SNAPSHOT.jar
echo 2. Or deploy to Docker/Kubernetes/Cloud platform
echo.
echo Example commands:
echo   Local: java -jar target/paf-backend-0.0.1-SNAPSHOT.jar
echo   Docker: docker build -t paf-backend . ^&^& docker run -p 8080:8080 paf-backend
echo   Heroku: heroku login ^&^& git push heroku main
echo.
cd ..
