# Dockerfile for Auth Service
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/auth-service-1.0-SNAPSHOT.jar auth-service.jar
ENTRYPOINT ["java", "-jar", "/auth-service.jar"]
