@echo off

call pm2 start  ./monit.json
echo utf-8
echo ·��  %cd%
echo "use ping to delay"
set SLEEP=ping 127.0.0.1 /n
echo ��ʼ %time%
%SLEEP% 8 > nul
echo ���� %time%

title "hos_server"
pm2 logs