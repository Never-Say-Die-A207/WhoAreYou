### 특정 포트가 이미 사용중일 때
* 명령 프롬프트에서 `netstat -ano | findstr "포트번호"`로

  해당 포트를 사용 중인 프로세스를 확인


* PID를 확인 후 `taskkill /f /pid "포트번호"`로 강제 종료