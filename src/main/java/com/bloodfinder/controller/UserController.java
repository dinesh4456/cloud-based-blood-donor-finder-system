package com.bloodfinder.controller;

import com.bloodfinder.dto.request.ChangePasswordRequest;
import com.bloodfinder.dto.request.UserUpdateRequest;
import com.bloodfinder.dto.response.ApiResponse;
import com.bloodfinder.dto.response.UserProfileResponse;
import com.bloodfinder.security.UserPrincipal;
import com.bloodfinder.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("Fetching profile for authenticated user: {}", currentUser.getUsername());
        UserProfileResponse response = userService.getProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody UserUpdateRequest request) {
        log.info("Updating profile for authenticated user: {}", currentUser.getUsername());
        UserProfileResponse response = userService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ChangePasswordRequest request) {
        log.info("Changing password for authenticated user: {}", currentUser.getUsername());
        userService.changePassword(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
