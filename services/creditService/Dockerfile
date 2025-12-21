FROM eclipse-temurin:21-jdk-alpine
LABEL maintainer="meryemoruc.c@gmail.com"
LABEL description="Credit Service - Credit Scoring & Approval"
LABEL version="1.0"
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]