package com.bloodfinder;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class HealthCheckControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/health should return UP with database and memory metrics")
    void testGetHealthStatus() throws Exception {
        mockMvc.perform(get("/api/health")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("blood-donor-finder-system"))
                .andExpect(jsonPath("$.version").value("1.0.0"))
                .andExpect(jsonPath("$.database").value("UP"))
                .andExpect(jsonPath("$.memory.totalMB").isNumber())
                .andExpect(jsonPath("$.memory.freeMB").isNumber());
    }

    @Test
    @DisplayName("GET /api/health/ready should return READY 200 OK for ALB readiness probes")
    void testReadinessProbe() throws Exception {
        mockMvc.perform(get("/api/health/ready"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("READY"));
    }
}
