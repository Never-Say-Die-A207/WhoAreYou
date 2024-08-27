### 특정 포트가 이미 사용중일 때
1. Windows
* 명령 프롬프트에서 `netstat -ano | findstr "포트번호"`로

  해당 포트를 사용 중인 프로세스를 확인


* PID(프로세스 아이디)를 확인 후 `taskkill /f /pid 프로세스아이디`로 강제 종료

2. Linux 
* sudo netstat -ntlp | grep :포트번호
  * sudo를 해야 프로세스 번호를 확인할 수 있음
* sudo kill 프로세스아이디


### linux CLI 명령어
- ctrl + u : 입력 중인 커서 앞까지 삭제 = 줄 삭제

### docker 명령어
- docker image prune : 안 쓰는 이미지 정리
- docker exec -it 컨테이너ID(또는 이름) bash : 해당 컨테이너에 bash 셸로 접속 = 직접 실행해보거나 내부 설정을 변경할 수 있다
- docker logs 컨테이너ID(또는 이름) : 해당 컨테이너에서 발생한 로그 내역을 출력

### 자주 발생하는 오류
