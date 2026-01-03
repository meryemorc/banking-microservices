NextBank - Full-Stack Microservices Banking Application
Teknolojiler: Spring Boot 3.x, Spring Cloud, React 18, PostgreSQL, RabbitMQ, Docker, Eureka Server, Spring Security, JWT, Maven

Dağıtık Mimari Geliştirme: Spring Boot ve REST API'ler kullanarak 6 bağımsız mikroservisten (User, Account, Transaction, Credit, API Gateway, Service Discovery) oluşan dağıtık bir bankacılık sistemi geliştirdim.

Merkezi Güvenlik ve Yetkilendirme: Tüm servisler için Spring Security ve API Gateway üzerinden yönetilen, JWT tabanlı kimlik doğrulama ve rol tabanlı (User/Admin) yetkilendirme mekanizmasını hayata geçirdim.

Servis Keşfi ve Yük Dengeleme: Dinamik servis kaydı için Eureka Service Discovery ve isteklerin verimli dağıtılması için yük dengeleme (Load Balancing) yapılandırmasını içeren mikroservis mimarisini tasarladım ve yayına aldım.

Asenkron Mesajlaşma: Kredi başvuru iş akışları ve işlem bildirimleri süreçlerinde servisler arası asenkron iletişimi yönetmek için RabbitMQ mesaj kuyruğu yapısını kurdum.

Konteynerizasyon ve Orkestrasyon: Geliştirme ve üretim ortamlarında tek komutla kurulum sağlayan Docker ve docker-compose orkestrasyonu ile tüm servisleri konteynerize ettim.

Dinamik Frontend Geliştirme: Gerçek zamanlı bankacılık işlemleri için RESTful backend API'leri ile entegre çalışan, React Router ile SPA navigasyonuna sahip duyarlı (responsive) bir React 18 arayüzü oluşturdum.

CI/CD İş Akışı: Maven build, Docker imaj üretimi, Docker Hub push ve sıfır kesinti (zero-downtime) ile güncelleme sağlayan tam otomatize bir CI/CD süreci kurguladım.

Veri İzolasyonu ve Ölçeklenebilirlik: Her mikroservisin bağımsız ölçeklenebilmesini ve veri izolasyonunu sağlamak amacıyla PostgreSQL ile "database-per-service" desenini uyguladım.

Gelişmiş API Gateway: İstek yönlendirme, header injection (X-User-ID) ve kimlik doğrulama/günlükleme (logging) gibi ortak kesişen ilgileri (cross-cutting concerns) yöneten merkezi bir API Gateway geliştirdim.

-----------------------------------------------------------------------------------------------------------------


NextBank - Full-Stack Microservices Banking Application
Technologies: Spring Boot, React, Docker, PostgreSQL, RabbitMQ, Eureka, JWT

- Developed a distributed banking system with 6 independent microservices (User, Account, 
  Transaction, Credit, API Gateway, Service Discovery) using Spring Boot and REST APIs
  
- Implemented JWT-based authentication and role-based authorization (User/Admin) with 
  Spring Security across all services via API Gateway
  
- Designed and deployed microservices architecture with Eureka Service Discovery for 
  dynamic service registration and Netflix Load Balancer for request distribution
  
- Built asynchronous communication between services using RabbitMQ message broker for 
  credit application workflows and transaction notifications
  
- Containerized all services using Docker with docker-compose orchestration, enabling 
  one-command deployment across development and production environments
  
- Created responsive React frontend with React Router for SPA navigation, integrated 
  with RESTful backend APIs for real-time banking operations
  
- Established CI/CD workflow: Maven build → Docker image creation → Docker Hub push → 
  Container deployment with zero-downtime updates
  
- Implemented database-per-service pattern with PostgreSQL, ensuring data isolation 
  and independent scalability for each microservice
  
- Developed centralized API Gateway for request routing, header injection (X-User-ID), 
  and cross-cutting concerns (authentication, logging)
  
- Technologies: Spring Boot 3.x, Spring Cloud, React 18, PostgreSQL, RabbitMQ, Docker, 
  Eureka Server, Spring Security, JWT, Maven
