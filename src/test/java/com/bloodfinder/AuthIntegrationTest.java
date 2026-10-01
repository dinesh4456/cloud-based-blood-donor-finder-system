package com.bloodfinder;

import com.bloodfinder.dto.request.LoginRequest;
import com.bloodfinder.dto.request.RegisterRequest;
import com.bloodfinder.entity.enums.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/auth/login with valid admin credentials should return JWT token")
    void testAdminLoginSuccess() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .email("admin@bloodfinder.com")
                .password("Admin@123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isString())
                .andExpect(jsonPath("$.data.type").value("Bearer"))
                .andExpect(jsonPath("$.data.email").value("admin@bloodfinder.com"))
                .andExpect(jsonPath("$.data.role").value("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("POST /api/auth/login with wrong password should return 401 Unauthorized")
    void testLoginInvalidPassword() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .email("admin@bloodfinder.com")
                .password("WrongPassword999")
                .build();

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/register should create a new account successfully")
    void testRegisterNewUserSuccess() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .name("Test New User")
                .email("test.newuser." + System.currentTimeMillis() + "@example.com")
                .password("User@12345")
                .phone("+91-9988776655")
                .role(Role.ROLE_USER)
                .build();

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isString())
                .andExpect(jsonPath("$.data.name").value("Test New User"))
                .andExpect(jsonPath("$.data.role").value("ROLE_USER"));
    }

    @Test
    @DisplayName("POST /api/auth/register with duplicate email should return 409 Conflict")
    void testRegisterDuplicateEmail() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .name("Admin Clone")
                .email("admin@bloodfinder.com")
                .password("Admin@123")
                .phone("+1-555-9999")
                .role(Role.ROLE_USER)
                .build();

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }
}
