@echo off

echo Iniciando projeto To-Do List...

start "Backend - FastAPI" cmd /k "cd /d ""%~dp0backend"" && call .venv\Scripts\activate.bat && python -m uvicorn app.main:app --reload"

start "Frontend - React" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo Backend e frontend iniciados!