FROM openjdk:17
ARG JAR_FILE=build/libs/*SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
#ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=${PROFIE}", "/app.jar"]