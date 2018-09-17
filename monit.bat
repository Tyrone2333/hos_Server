@echo off

call pm2 start  ./monit.json
echo utf-8
echo 路径  %cd%
echo "use ping to delay"
set SLEEP=ping 127.0.0.1 /n
echo 开始 %time%
%SLEEP% 8 > nul
echo 结束 %time%

title "hos_server"
pm2 logs