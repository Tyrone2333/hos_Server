@echo off
call pm2 start  ./dev-server.js  --watch
echo 使用ansi编码
echo 当前路径  %cd%  
echo "use ping to delay"
set SLEEP=ping 127.0.0.1 /n
echo 正在等待，等待开始时间：%time%
%SLEEP% 10 > nul
echo 等待结束时间：%time%

pm2 logs