@echo off
title SpainRoom - REBUILD FRONTEND
echo Cerrando procesos que pueden bloquear...
taskkill /F /IM node.exe 2>NUL
taskkill /F /IM esbuild.exe 2>NUL
taskkill /F /IM rollup.exe 2>NUL

echo Quitando atributos de solo lectura del directorio node_modules...
attrib -r -s -h /s /d node_modules 2>NUL

echo Borrando node_modules...
rmdir /s /q node_modules 2>NUL

if exist node_modules (
  echo node_modules sigue bloqueado. Intentando rimraf...
  npx rimraf node_modules
)

echo Borrando package-lock.json...
del /f /q package-lock.json 2>NUL

echo Instalando dependencias...
npm install

echo Lanzando servidor de desarrollo (Vite)...
npm run dev

pause
