### 특정 포트가 이미 사용중일 때
1. Windows
* 명령 프롬프트에서 `netstat -ano | findstr "포트번호"`로

  해당 포트를 사용 중인 프로세스를 확인


* PID(프로세스 아이디)를 확인 후 `taskkill /f /pid 프로세스아이디`로 강제 종료

2. Linux 
* sudo netstat -ntlp | grep :포트번호
* kill 프로세스아이디