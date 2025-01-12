# Dockerfile for Task Service
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/task-service-1.0-SNAPSHOT-exec.jar task-service.jar
ENTRYPOINT ["java", "-jar", "/task-service.jar"]
