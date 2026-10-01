package com.bloodfinder.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Slf4j
public class HealthCheckController {

    private final DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> health = new LinkedHashMap<>();
        boolean isDbHealthy = checkDatabaseHealth();
        long uptime = ManagementFactory.getRuntimeMXBean().getUptime();

        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory() / (1024 * 1024);
        long freeMemory = runtime.freeMemory() / (1024 * 1024);
        long maxMemory = runtime.maxMemory() / (1024 * 1024);
        long usedMemory = totalMemory - freeMemory;

        Map<String, Object> memoryDetails = new LinkedHashMap<>();
        memoryDetails.put("usedMB", usedMemory);
        memoryDetails.put("freeMB", freeMemory);
        memoryDetails.put("totalMB", totalMemory);
        memoryDetails.put("maxMB", maxMemory);

        health.put("status", isDbHealthy ? "UP" : "DOWN");
        health.put("service", "blood-donor-finder-system");
        health.put("version", "1.0.0");
        health.put("timestamp", Instant.now().toString());
        health.put("uptimeMs", uptime);
        health.put("database", isDbHealthy ? "UP" : "DOWN");
        health.put("memory", memoryDetails);

        HttpStatus status = isDbHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
        return ResponseEntity.status(status).body(health);
    }

    @GetMapping("/ready")
    public ResponseEntity<Map<String, String>> readinessProbe() {
        boolean isDbHealthy = checkDatabaseHealth();
        Map<String, String> response = new LinkedHashMap<>();

        if (isDbHealthy) {
            response.put("status", "READY");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "NOT_READY");
            response.put("reason", "Database connectivity failure");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }

    private boolean checkDatabaseHealth() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(2);
        } catch (Exception e) {
            log.error("Health check database probe failed: {}", e.getMessage());
            return false;
        }
    }
}
