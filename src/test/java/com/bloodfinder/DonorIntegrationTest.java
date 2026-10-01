package com.bloodfinder;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class DonorIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/donors/search should return list of seeded donors wrapped in ApiResponse")
    void testSearchAllDonors() throws Exception {
        mockMvc.perform(get("/api/donors/search")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("GET /api/donors/search?bloodGroup=O_POSITIVE should filter by blood group")
    void testSearchDonorsByBloodGroup() throws Exception {
        mockMvc.perform(get("/api/donors/search")
                .param("bloodGroup", "O_POSITIVE")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].bloodGroup").value("O+"));
    }

    @Test
    @DisplayName("GET /api/donors/search?city=Mumbai should filter donors by city")
    void testSearchDonorsByCity() throws Exception {
        mockMvc.perform(get("/api/donors/search")
                .param("city", "Mumbai")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].city").value("Mumbai"));
    }

    @Test
    @DisplayName("GET /api/donors/available should return available donors")
    void testGetAvailableDonors() throws Exception {
        mockMvc.perform(get("/api/donors/available")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].availabilityStatus").value("AVAILABLE"));
    }

    @Test
    @DisplayName("GET /api/donors/stats/summary should return donor counts per blood group")
    void testGetDonorStatsSummary() throws Exception {
        mockMvc.perform(get("/api/donors/stats/summary")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data['O+']").isNumber())
                .andExpect(jsonPath("$.data['A+']").isNumber())
                .andExpect(jsonPath("$.data['B+']").isNumber());
    }
}
