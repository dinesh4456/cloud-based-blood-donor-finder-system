# ==============================================================================
# Multi-Stage Dockerfile for Blood Donor Finder System
# Optimized for AWS ECS (Fargate), AWS App Runner, and EC2 Docker
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Application JAR
# ------------------------------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copy Maven descriptor and download dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy application source code
COPY src ./src

# Build production JAR (skipping unit tests during image build)
RUN mvn clean package -DskipTests -B

# ------------------------------------------------------------------------------
# Stage 2: Lightweight Production Runtime Image
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="Blood Donor Finder Team"
LABEL description="Cloud-Based Blood Donor Finder System"

# Install curl for AWS / Docker container health checks
RUN apk add --no-cache curl tzdata

# Create dedicated non-root application user and group for security
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

# Copy executable fat JAR from builder stage
COPY --from=builder /build/target/blood-donor-finder-system-1.0.0.jar app.jar

# Set permissions for non-root execution
RUN chown -R spring:spring /app

USER spring:spring

# Expose standard application port
EXPOSE 8080

# Configure container health check targeting the cloud health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Performance-tuned JVM options for containerized environments
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
