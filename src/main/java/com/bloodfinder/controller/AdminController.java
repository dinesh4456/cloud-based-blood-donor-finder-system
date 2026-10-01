package com.bloodfinder.controller;

import com.bloodfinder.dto.request.UserStatusUpdateDto;
import com.bloodfinder.dto.response.*;
import com.bloodfinder.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        log.info("Admin requested dashboard statistics");
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved successfully", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        log.info("Admin requested user list");
        List<UserProfileResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateDto request) {
        log.info("Admin requested updating status of user id {} to {}", id, request.getStatus());
        UserProfileResponse updatedUser = adminService.updateUserStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updatedUser));
    }

    @GetMapping("/donors")
    public ResponseEntity<ApiResponse<List<DonorResponse>>> getAllDonors() {
        log.info("Admin requested donor list");
        List<DonorResponse> donors = adminService.getAllDonors();
        return ResponseEntity.ok(ApiResponse.success("Donors retrieved successfully", donors));
    }

    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<BloodRequestResponse>>> getAllBloodRequests() {
        log.info("Admin requested all blood requests");
        List<BloodRequestResponse> requests = adminService.getAllBloodRequests();
        return ResponseEntity.ok(ApiResponse.success("Blood requests retrieved successfully", requests));
    }
}
