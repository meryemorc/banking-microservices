FROM eclipse-temurin:21-jdk-alpine
LABEL maintainer="meryyemoruc.c@gmail.com"
LABEL description="Eureka Server for Service Discovery"
LABEL version="1.0"
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]