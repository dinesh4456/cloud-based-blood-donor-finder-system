package com.bloodfinder.service.impl;

import com.bloodfinder.dto.response.BloodRequestResponse;
import com.bloodfinder.dto.response.DashboardStatsResponse;
import com.bloodfinder.dto.response.DonorResponse;
import com.bloodfinder.dto.response.UserProfileResponse;
import com.bloodfinder.entity.BloodRequest;
import com.bloodfinder.entity.Donor;
import com.bloodfinder.entity.User;
import com.bloodfinder.entity.enums.AvailabilityStatus;
import com.bloodfinder.entity.enums.RequestStatus;
import com.bloodfinder.entity.enums.Role;
import com.bloodfinder.entity.enums.UserStatus;
import com.bloodfinder.exception.BadRequestException;
import com.bloodfinder.exception.ResourceNotFoundException;
import com.bloodfinder.repository.BloodRequestRepository;
import com.bloodfinder.repository.DonorRepository;
import com.bloodfinder.repository.UserRepository;
import com.bloodfinder.service.AdminService;
import com.bloodfinder.service.DonorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final DonorService donorService;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        log.info("Calculating admin dashboard statistics");

        long totalUsers = userRepository.count();
        long totalDonors = donorRepository.count();
        long availableDonors = donorRepository.countByAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        long unavailableDonors = donorRepository.countByAvailabilityStatus(AvailabilityStatus.UNAVAILABLE);

        long totalBloodRequests = bloodRequestRepository.count();
        long pendingRequests = bloodRequestRepository.countByStatus(RequestStatus.PENDING);
        long acceptedRequests = bloodRequestRepository.countByStatus(RequestStatus.ACCEPTED);
        long completedRequests = bloodRequestRepository.countByStatus(RequestStatus.COMPLETED);
        long rejectedRequests = bloodRequestRepository.countByStatus(RequestStatus.REJECTED);

        Map<String, Long> bloodGroupCounts = donorService.getBloodGroupDistribution();

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalDonors(totalDonors)
                .availableDonors(availableDonors)
                .unavailableDonors(unavailableDonors)
                .totalBloodRequests(totalBloodRequests)
                .pendingRequests(pendingRequests)
                .acceptedRequests(acceptedRequests)
                .completedRequests(completedRequests)
                .rejectedRequests(rejectedRequests)
                .bloodGroupCounts(bloodGroupCounts)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllUsers() {
        log.info("Retrieving all users for admin view");
        return userRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(user -> {
                    Optional<Donor> donorOpt = donorRepository.findByUserId(user.getId());
                    DonorResponse donorResponse = donorOpt.map(this::mapDonorToResponse).orElse(null);

                    return UserProfileResponse.builder()
                            .id(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .phone(user.getPhone())
                            .role(user.getRole())
                            .status(user.getStatus())
                            .isDonor(donorOpt.isPresent())
                            .donorDetails(donorResponse)
                            .createdAt(user.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserProfileResponse updateUserStatus(Long userId, UserStatus status) {
        log.info("Updating user {} status to {}", userId, status);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.getRole() == Role.ROLE_ADMIN && status == UserStatus.BLOCKED) {
            throw new BadRequestException("Cannot block an administrator account");
        }

        user.setStatus(status);
        User savedUser = userRepository.save(user);

        // If blocking, also toggle donor availability to UNAVAILABLE
        if (status == UserStatus.BLOCKED) {
            donorRepository.findByUserId(userId).ifPresent(donor -> {
                donor.setAvailabilityStatus(AvailabilityStatus.UNAVAILABLE);
                donorRepository.save(donor);
            });
        }

        Optional<Donor> donorOpt = donorRepository.findByUserId(savedUser.getId());
        DonorResponse donorResponse = donorOpt.map(this::mapDonorToResponse).orElse(null);

        return UserProfileResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole())
                .status(savedUser.getStatus())
                .isDonor(donorOpt.isPresent())
                .donorDetails(donorResponse)
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonorResponse> getAllDonors() {
        log.info("Retrieving all donors for admin view");
        return donorRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapDonorToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BloodRequestResponse> getAllBloodRequests() {
        log.info("Retrieving all blood requests for admin view");
        return bloodRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapRequestToResponse)
                .collect(Collectors.toList());
    }

    private DonorResponse mapDonorToResponse(Donor donor) {
        return DonorResponse.builder()
                .id(donor.getId())
                .userId(donor.getUser().getId())
                .name(donor.getUser().getName())
                .email(donor.getUser().getEmail())
                .bloodGroup(donor.getBloodGroup())
                .bloodGroupDisplay(donor.getBloodGroup().getDisplayName())
                .country(donor.getCountry())
                .state(donor.getState())
                .district(donor.getDistrict())
                .city(donor.getCity())
                .address(donor.getAddress())
                .contactNumber(donor.getContactNumber())
                .lastDonationDate(donor.getLastDonationDate())
                .availabilityStatus(donor.getAvailabilityStatus())
                .totalDonations(donor.getTotalDonations())
                .createdAt(donor.getCreatedAt())
                .build();
    }

    private BloodRequestResponse mapRequestToResponse(BloodRequest request) {
        Donor donor = request.getDonor();
        return BloodRequestResponse.builder()
                .id(request.getId())
                .requesterId(request.getRequester().getId())
                .requesterName(request.getRequester().getName())
                .requesterEmail(request.getRequester().getEmail())
                .requesterPhone(request.getRequester().getPhone())
                .donorId(donor != null ? donor.getId() : null)
                .donorName(donor != null ? donor.getUser().getName() : "Open Request (Any Available Donor)")
                .donorPhone(donor != null ? donor.getContactNumber() : null)
                .patientName(request.getPatientName())
                .bloodGroup(request.getBloodGroup())
                .bloodGroupDisplay(request.getBloodGroup().getDisplayName())
                .hospitalName(request.getHospitalName())
                .hospitalAddress(request.getHospitalAddress())
                .city(request.getCity())
                .contactNumber(request.getContactNumber())
                .requiredUnits(request.getRequiredUnits())
                .urgencyLevel(request.getUrgencyLevel())
                .status(request.getStatus())
                .additionalNotes(request.getAdditionalNotes())
                .neededBefore(request.getNeededBefore())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}
