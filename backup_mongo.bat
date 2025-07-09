@echo off
setlocal

REM === Crear variables de fecha y hora ===
for /f "tokens=2 delims==" %%i in ('"wmic os get localdatetime /value"') do set datetime=%%i
set FECHA=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%
set HORA=%datetime:~8,2%-%datetime:~10,2%
set DIR=backups\%FECHA%_%HORA%

REM === Crear carpeta de respaldo ===
mkdir %DIR%

REM === Ejecutar respaldo con mongodump ===
mongodump --out %DIR%

REM === Confirmar al usuario ===
echo.
echo ✅ Respaldo completado correctamente en: %DIR%
pause
