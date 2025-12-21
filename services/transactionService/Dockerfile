FROM eclipse-temurin:21-jdk-alpine
LABEL maintainer="meryyemoruc.c@gmail.com"
LABEL description="Transaction Service - Transaction History & Recording"
LABEL version="1.0"
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]