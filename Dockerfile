# Stage 1: Frontend Build
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Package.json ve package-lock.json'ı kopyala
COPY frontend/package*.json ./

# Bağımlılıkları yükle
RUN npm ci

# Frontend kaynak kodlarını kopyala
COPY frontend/ ./

# Frontend'i build et (dist veya build klasörü oluşur)
RUN npm run build

# Stage 2: Backend Build
FROM maven:3.9-eclipse-temurin-17-alpine AS backend-build

WORKDIR /app

# POM dosyasını önce kopyala (cache için)
COPY backend/pom.xml ./backend/
COPY backend/.mvn ./backend/.mvn
COPY backend/mvnw ./backend/

# Maven wrapper çalıştırılabilir yap
RUN chmod +x ./backend/mvnw

# Bağımlılıkları önceden indir (cache layer)
WORKDIR /app/backend
RUN mvn dependency:go-offline -B

# Backend kaynak kodlarını kopyala
COPY backend/src ./src

# Frontend build çıktısını backend static klasörüne kopyala
COPY --from=frontend-build /app/frontend/dist /app/backend/src/main/resources/static/

# Backend'i build et
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Images dizinini oluştur
RUN mkdir -p /app/images

# Build edilen JAR dosyasını kopyala
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/actuator/health || exit 1

# Uygulamayı başlat
ENTRYPOINT ["java", "-jar", "app.jar"]