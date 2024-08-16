# ![로고 이미지](/frontend/src/assets/logoimg.jpg) WHO ARE YOU
<hr>

##  🎥 프로젝트 개요
> OpenVidu와 SockJs를 활용해 실시간 화상 회의와 채팅을 기반으로 한 소개팅 서비스

### 프로젝트 제안배경
> 기존 소개팅이 외모에 기반한 소개팅, 지루하고 재미없는 소개팅,<br/> 상대방의 감정 파악의 어려움을 느껴 재미 요소를 보장하고,<br/> 외모보단 성격 및 상대방 감정 분석이 가능한 <br/> 비대면 소개팅 서비스를 제공

### 개발 기간
> 2024-07-02 ~ 2024 -08-16

### 🧑‍🤝‍🧑 Team members 
 |  Backend  | Frontend |
 | --------- | ---------|
 |   이지은, 조성욱, 황태건  |  서승호, 장승연, 최희현   |

<hr>

### 실행 환경 
> |   TECH    | Version  |
> | --------- | ---------|
> |   React  |  18.3.1 |
> |   livekit-client     |  2.4.0  |
> |   spring boot   | 3.3.2  |
> |    java  | 17 |
> |    mySQL  | 8.0.33  |
> |   jwt  | 0.11.2  |
> |   junit | 5.12.0   |
> |   mongodb  | 3.3.0   |
> |   kafka  | 3.8.0   |
> |   oauth  | 2.0   |


</br>

## 💻 Tech Stack
### 🔐 Backend
><img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"><img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"><img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"><img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white"><img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white"> 


### 🌅 Front-end
>   <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"><img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">  

## 사용 방법
### 🔐 Backend
> ```
> $ ./gradlew clean build;
> $ java -jar build/libs/*SNAPSHOT.jar
> ```
### 🌅 Front-end
> ```
> $ npm install
> $ npm start
> ```


## 🖥️ 목표 서비스 구현 및 실제 구현 정도 및 핵심 기능 설명

|회원가입|
| :---: |
|![회원가입](/frontend/src/assets/signup.png)|
|<회원가입&로그인> <br/> - 중복 이메일, 닉네임 체크 <br /> - 약관동의 |
<hr>

|가면 미리보기 페이지|
| :---: |
|![영화 상세 페이지](/frontend/src/assets/previewpage.png)|
| <로그인 성공 후 페이지> <br /> - google mediaPipe를 통해 얼굴 인식 <br /> - landmark 좌표를 기반으로 3D 가면 디자인 <br />|
<hr>

|소개팅 페이지|
| :---: |
|![소개팅](/frontend/src/assets/mainpage.png)|
| <소개팅 메인 페이지> <br /> - openvidu 실시간 비디오 스트리밍과 화상 회의 구현 <br /> - 브라우저와 서버 간의 안정적인 실시간 통신 보장 <br /> - 비디오 내에서 얼굴을 인식하고, 인공지능 기술을 이용하여 감정 분석 <br />|
<hr>

|일반채팅 페이지|
| :---: |
|![일반채팅](/frontend/src/assets/chat.png)|
| <일반채팅 페이지> <br /> - websocket & stomp 프로토콜 사용 <br /> - 오픈소스 비관계형 데이터베이스 관리시스템 활용 <br />|
<hr>

## ERD
|![ERD](/frontend/src/assets/erd.png)|



## 느낀점
> 1. 서승호(프론트엔드)
> - AI 활용해서 얼굴 인식 및 가면 디자인 흥미
> 2. 이지은(백엔드)
> - 팀장으로서 유의미한 시간이었음
> 3. 장승연(프론트엔드)
> - 스스로 공부해가며 개발에 필요한 내용을 직접 찾아보고 배워서<br/> 유의미한 시간
> 4. 조성욱(백엔드)
> - 더 완성도 높은 기능에 대해 고민하고 싶어짐
> 5. 최희현(프론트엔드)
> - 기획 단계의 목적을 분명하게 해야 개발자들이 기술 개발하기 용이
> 6. 황태건(백엔드)
> - 인프라는 처음 해보는데 도움이 되는 경험이였습니다. <br/>그래도 다음에는 백엔드 개발에 집중해보고 싶습니다.<br/> 팀원들 덕분에 즐거웠습니다. 굿
