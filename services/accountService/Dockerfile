FROM eclipse-temurin:21-jdk-alpine
LABEL maintainer="meryyemoruc.c@gmail.com"
LABEL description="Account Service - Account Management & Transfers"
LABEL version="1.0"
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]