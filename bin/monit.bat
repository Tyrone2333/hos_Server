@echo off
call pm2 start  ./dev-server.js  --watch
echo ʹ��ansi����
echo ��ǰ·��  %cd%  
echo "use ping to delay"
set SLEEP=ping 127.0.0.1 /n
echo ���ڵȴ����ȴ���ʼʱ�䣺%time%
%SLEEP% 10 > nul
echo �ȴ�����ʱ�䣺%time%

pm2 logs