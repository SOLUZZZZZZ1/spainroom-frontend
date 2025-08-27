@echo off
title SpainRoom - Copiar CSV del mapa a frontend/public/data

REM === CONFIGURA AQUÍ EL ORIGEN SI LO NECESITAS ===
REM Ruta por defecto del CSV en Descargas:
set "SRC=C:\Users\soluz\Downloads\mapa_cedula_provincias.csv"

REM Si quieres elegir otro archivo manualmente, descomenta la línea siguiente:
REM set /p SRC=Ruta completa del CSV (ej. C:\Users\soluz\Desktop\mapa_cedula_provincias.csv):

REM === DESTINO (NO TOCAR) ===
set "DEST_DIR=C:\spainroom\frontend\public\data"
set "DEST=%DEST_DIR%\mapa_cedula_provincias.csv"

echo.
echo Origen:  %SRC%
echo Destino: %DEST%
echo.

IF NOT EXIST "%SRC%" (
  echo ❌ No se encuentra el archivo de origen.
  echo    Revisa la ruta: %SRC%
  pause
  exit /b 1
)

IF NOT EXIST "%DEST_DIR%" (
  echo Creando carpeta destino...
  mkdir "%DEST_DIR%"
)

echo Copiando archivo...
copy /Y "%SRC%" "%DEST%" >NUL
IF ERRORLEVEL 1 (
  echo ❌ Error al copiar el CSV.
  pause
  exit /b 1
)

echo ✅ CSV copiado correctamente.
echo.

REM Arranque opcional del frontend tras copiar
set /p LAUNCH=¿Quieres arrancar el frontend ahora? (S/N): 
if /I "%LAUNCH%"=="S" (
  cd frontend
  npm run dev
) else (
  echo Listo. Puedes lanzar el frontend cuando quieras con:
  echo     cd frontend
  echo     npm run dev
)

pause
