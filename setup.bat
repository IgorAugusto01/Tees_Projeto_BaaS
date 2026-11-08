
@echo off
setlocal

cd /d "%~dp0"

echo ========================================
echo   CONFIGURACAO DO PROJETO
echo ========================================
echo.

:: Verificar Python 3.13
echo [1/3] Verificando Python 3.13...

py -3.13 --version >nul 2>nul
if errorlevel 1 (
    echo ERRO: Python 3.13 nao encontrado.
    echo Instale o Python 3.13 antes de continuar.
    pause
    exit /b 1
)

:: Criar ambiente virtual
echo.
echo [2/3] Criando ambiente virtual Python...

if not exist "backend\.venv\Scripts\python.exe" (
    py -3.13 -m venv backend\.venv
    if errorlevel 1 (
        echo ERRO ao criar ambiente virtual.
        pause
        exit /b 1
    )
)

:: Instalar dependencias Python
echo.
echo Instalando dependencias do Python...

call backend\.venv\Scripts\python.exe -m pip install --upgrade pip
if errorlevel 1 goto erro

call backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
if errorlevel 1 goto erro

:: Instalar dependencias React
echo.
echo [3/3] Instalando dependencias do React...

if not exist "frontend\package.json" (
    echo ERRO: frontend\package.json nao encontrado.
    pause
    exit /b 1
)

cd frontend
call npm install
if errorlevel 1 goto erro

cd ..

echo.
echo ========================================
echo   CONFIGURACAO CONCLUIDA!
echo ========================================
echo.
pause
exit /b 0

:erro
echo.
echo ERRO durante a instalacao.
pause
exit /b 1
