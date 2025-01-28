# Dockerfile for Notification Service
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/notification-service-1.0-SNAPSHOT-exec.jar notification-service.jar
ENTRYPOINT ["java", "-jar", "/notification-service.jar"]
