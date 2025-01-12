@echo off
cd /d "%~dp0"
echo 正在启动姓名生成器...
start http://localhost:3000
npm run dev