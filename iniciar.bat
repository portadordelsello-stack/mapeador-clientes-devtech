@echo off
title GeoProspector AI - Santa Fe
echo Iniciando GeoProspector AI...
cd /d "%~dp0"
start "" http://localhost:3000
node server.js
pause
