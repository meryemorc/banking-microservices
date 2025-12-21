FROM eclipse-temurin:21-jdk-alpine
LABEL maintainer="meryyemoruc.c@gmail.com"
LABEL description="API Gateway for Banking Microservices"
LABEL version="1.0"
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]