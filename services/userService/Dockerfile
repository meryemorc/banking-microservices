FROM eclipse-temurin:21-jdk-alpine

LABEL maintainer="meryyemoruc.c@gmail.com"
LABEL description="User Service for Banking Microservices"
LABEL version = 1.0

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD curl -f http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]