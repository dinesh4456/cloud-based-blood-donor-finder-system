package com.bloodfinder.controller;

import com.bloodfinder.dto.request.BloodRequestCreateDto;
import com.bloodfinder.dto.request.BloodRequestStatusUpdateDto;
import com.bloodfinder.dto.response.ApiResponse;
import com.bloodfinder.dto.response.BloodRequestResponse;
import com.bloodfinder.security.UserPrincipal;
import com.bloodfinder.service.BloodRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@Slf4j
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    @PostMapping
    public ResponseEntity<ApiResponse<BloodRequestResponse>> createRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody BloodRequestCreateDto requestDto) {
        log.info("Creating blood request from user: {}", currentUser.getUsername());
        BloodRequestResponse response = bloodRequestService.createRequest(currentUser.getId(), requestDto);
        return new ResponseEntity<>(
                ApiResponse.success("Blood request created successfully", response),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BloodRequestResponse>> updateRequestStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody BloodRequestStatusUpdateDto statusDto) {
        log.info("User {} updating request {} status to {}", currentUser.getUsername(), id, statusDto.getStatus());
        BloodRequestResponse response = bloodRequestService.updateRequestStatus(currentUser.getId(), id, statusDto);
        return ResponseEntity.ok(ApiResponse.success("Blood request status updated to " + statusDto.getStatus(), response));
    }

    @GetMapping("/sent")
    public ResponseEntity<ApiResponse<List<BloodRequestResponse>>> getSentRequests(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("Retrieving sent requests for user: {}", currentUser.getUsername());
        List<BloodRequestResponse> requests = bloodRequestService.getSentRequests(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Sent requests retrieved successfully", requests));
    }

    @GetMapping("/received")
    public ResponseEntity<ApiResponse<List<BloodRequestResponse>>> getReceivedRequests(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("Retrieving received requests for user: {}", currentUser.getUsername());
        List<BloodRequestResponse> requests = bloodRequestService.getReceivedRequests(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Received requests retrieved successfully", requests));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BloodRequestResponse>> getRequestById(
            @PathVariable Long id) {
        BloodRequestResponse response = bloodRequestService.getRequestById(id);
        return ResponseEntity.ok(ApiResponse.success("Blood request details retrieved", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        log.info("Cancelling blood request {} by user {}", id, currentUser.getUsername());
        bloodRequestService.cancelRequest(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Blood request cancelled successfully", null));
    }
}
