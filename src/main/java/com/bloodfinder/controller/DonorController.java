package com.bloodfinder.controller;

import com.bloodfinder.dto.request.DonorRegisterRequest;
import com.bloodfinder.dto.request.DonorUpdateRequest;
import com.bloodfinder.dto.response.ApiResponse;
import com.bloodfinder.dto.response.DonorResponse;
import com.bloodfinder.entity.enums.AvailabilityStatus;
import com.bloodfinder.entity.enums.BloodGroup;
import com.bloodfinder.security.UserPrincipal;
import com.bloodfinder.service.DonorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
@Slf4j
public class DonorController {

    private final DonorService donorService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<DonorResponse>> registerDonor(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody DonorRegisterRequest request) {
        log.info("Donor registration requested by user: {}", currentUser.getUsername());
        DonorResponse response = donorService.registerDonor(currentUser.getId(), request);
        return new ResponseEntity<>(
                ApiResponse.success("Successfully registered as a blood donor", response),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<DonorResponse>> updateDonor(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody DonorUpdateRequest request) {
        log.info("Donor profile update requested by user: {}", currentUser.getUsername());
        DonorResponse response = donorService.updateDonor(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Donor profile updated successfully", response));
    }

    @PatchMapping("/toggle-availability")
    public ResponseEntity<ApiResponse<DonorResponse>> toggleAvailability(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("Donor availability toggle requested by user: {}", currentUser.getUsername());
        DonorResponse response = donorService.toggleAvailability(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Donor availability status updated", response));
    }

    @GetMapping("/my-profile")
    public ResponseEntity<ApiResponse<DonorResponse>> getMyDonorProfile(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DonorResponse response = donorService.getDonorByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Donor profile retrieved successfully", response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DonorResponse>>> searchDonors(
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String mandal,
            @RequestParam(required = false) String village,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) AvailabilityStatus availability) {

        BloodGroup parsedBloodGroup = null;
        if (bloodGroup != null && !bloodGroup.trim().isEmpty()) {
            parsedBloodGroup = BloodGroup.fromString(bloodGroup);
        }

        log.info("Public search request - bloodGroup: {}, country: {}, state: {}, district: {}, mandal: {}, village: {}, city: {}, availability: {}", 
                parsedBloodGroup, country, state, district, mandal, village, city, availability);
        List<DonorResponse> donors = donorService.searchDonors(parsedBloodGroup, country, state, district, mandal, village, city, availability);
        return ResponseEntity.ok(ApiResponse.success("Donors retrieved successfully", donors));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<DonorResponse>>> getAvailableDonors() {
        List<DonorResponse> donors = donorService.getAvailableDonors();
        return ResponseEntity.ok(ApiResponse.success("Available donors retrieved successfully", donors));
    }

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<ApiResponse<DonorResponse>> getDonorById(@PathVariable Long id) {
        DonorResponse donor = donorService.getDonorById(id);
        return ResponseEntity.ok(ApiResponse.success("Donor details retrieved successfully", donor));
    }

    @GetMapping("/stats/summary")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getBloodGroupSummary() {
        Map<String, Long> summary = donorService.getBloodGroupDistribution();
        return ResponseEntity.ok(ApiResponse.success("Blood group statistics retrieved", summary));
    }

    @PostMapping(value = "/profile-photo", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('DONOR', 'USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<DonorResponse>> uploadProfilePhoto(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        log.info("User {} uploading donor profile photo", currentUser.getId());
        DonorResponse response = donorService.uploadProfilePhoto(currentUser.getId(), file);
        return ResponseEntity.ok(ApiResponse.success("Profile photo uploaded successfully", response));
    }

}
