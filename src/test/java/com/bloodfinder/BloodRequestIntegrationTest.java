package com.bloodfinder;

import com.bloodfinder.dto.request.BloodRequestCreateDto;
import com.bloodfinder.dto.request.LoginRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class BloodRequestIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String userToken;

    @BeforeEach
    void setUp() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .email("john.doe@example.com")
                .password("User@123")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode rootNode = objectMapper.readTree(result.getResponse().getContentAsString());
        userToken = rootNode.get("data").get("token").asText();
    }

    @Test
    @DisplayName("GET /api/requests/sent without token should return 401 Unauthorized")
    void testGetRequestsWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/requests/sent")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/requests with authenticated user should create blood request")
    void testCreateBloodRequestSuccess() throws Exception {
        BloodRequestCreateDto createDto = BloodRequestCreateDto.builder()
                .patientName("Integration Test Patient")
                .bloodGroup(com.bloodfinder.entity.enums.BloodGroup.B_POSITIVE)
                .hospitalName("City General Hospital")
                .hospitalAddress("Central Avenue, Block B")
                .city("Bangalore")
                .contactNumber("+91-9876543220")
                .requiredUnits(2)
                .urgencyLevel(com.bloodfinder.entity.enums.UrgencyLevel.HIGH)
                .additionalNotes("Platelets needed for surgery")
                .neededBefore(LocalDate.now().plusDays(2))
                .build();

        mockMvc.perform(post("/api/requests")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.patientName").value("Integration Test Patient"))
                .andExpect(jsonPath("$.data.bloodGroup").value("B+"))
                .andExpect(jsonPath("$.data.status").value("PENDING"));
    }

    @Test
    @DisplayName("GET /api/requests/sent with authenticated user should return list of requests")
    void testGetSentRequests() throws Exception {
        mockMvc.perform(get("/api/requests/sent")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }
}
