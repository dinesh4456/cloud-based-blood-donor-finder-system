package com.bloodfinder.service.impl;

import com.bloodfinder.dto.request.BloodRequestCreateDto;
import com.bloodfinder.dto.request.BloodRequestStatusUpdateDto;
import com.bloodfinder.dto.response.BloodRequestResponse;
import com.bloodfinder.entity.BloodRequest;
import com.bloodfinder.entity.Donor;
import com.bloodfinder.entity.User;
import com.bloodfinder.entity.enums.RequestStatus;
import com.bloodfinder.entity.enums.Role;
import com.bloodfinder.entity.enums.UrgencyLevel;
import com.bloodfinder.exception.BadRequestException;
import com.bloodfinder.exception.ResourceNotFoundException;
import com.bloodfinder.exception.UnauthorizedException;
import com.bloodfinder.repository.BloodRequestRepository;
import com.bloodfinder.repository.DonorRepository;
import com.bloodfinder.repository.UserRepository;
import com.bloodfinder.service.BloodRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BloodRequestServiceImpl implements BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final UserRepository userRepository;
    private final DonorRepository donorRepository;

    @Override
    @Transactional
    public BloodRequestResponse createRequest(Long requesterId, BloodRequestCreateDto requestDto) {
        log.info("Creating blood request by user id: {}", requesterId);

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", requesterId));

        Donor donor = null;
        if (requestDto.getDonorId() != null) {
            donor = donorRepository.findById(requestDto.getDonorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Donor", "id", requestDto.getDonorId()));

            if (donor.getUser().getId().equals(requesterId)) {
                throw new BadRequestException("You cannot send a blood request to yourself");
            }
        }

        UrgencyLevel urgency = requestDto.getUrgencyLevel() != null 
                ? requestDto.getUrgencyLevel() 
                : UrgencyLevel.MEDIUM;

        BloodRequest bloodRequest = BloodRequest.builder()
                .requester(requester)
                .donor(donor)
                .patientName(requestDto.getPatientName().trim())
                .bloodGroup(requestDto.getBloodGroup())
                .hospitalName(requestDto.getHospitalName().trim())
                .hospitalAddress(requestDto.getHospitalAddress() != null ? requestDto.getHospitalAddress().trim() : null)
                .city(requestDto.getCity().trim())
                .contactNumber(requestDto.getContactNumber().trim())
                .requiredUnits(requestDto.getRequiredUnits() != null ? requestDto.getRequiredUnits() : 1)
                .urgencyLevel(urgency)
                .status(RequestStatus.PENDING)
                .additionalNotes(requestDto.getAdditionalNotes() != null ? requestDto.getAdditionalNotes().trim() : null)
                .neededBefore(requestDto.getNeededBefore())
                .build();

        BloodRequest savedRequest = bloodRequestRepository.save(bloodRequest);
        log.info("Blood request created successfully with id: {}", savedRequest.getId());

        return mapToResponse(savedRequest);
    }

    @Override
    @Transactional
    public BloodRequestResponse updateRequestStatus(Long userId, Long requestId, BloodRequestStatusUpdateDto statusDto) {
        log.info("User {} updating status of blood request {} to {}", userId, requestId, statusDto.getStatus());

        BloodRequest bloodRequest = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BloodRequest", "id", requestId));

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        boolean isRequester = bloodRequest.getRequester().getId().equals(userId);
        boolean isAssignedDonor = bloodRequest.getDonor() != null && 
                bloodRequest.getDonor().getUser().getId().equals(userId);

        RequestStatus newStatus = statusDto.getStatus();

        // Authorization rules for status changes:
        // 1. Donor can ACCEPT or REJECT requests assigned to them
        // 2. Requester can CANCEL or mark COMPLETED
        // 3. Admin can perform any status transition
        if (!isAdmin) {
            if (newStatus == RequestStatus.ACCEPTED || newStatus == RequestStatus.REJECTED) {
                if (!isAssignedDonor) {
                    throw new UnauthorizedException("Only the requested donor or an admin can accept or reject this request");
                }
            } else if (newStatus == RequestStatus.CANCELLED) {
                if (!isRequester) {
                    throw new UnauthorizedException("Only the requester or an admin can cancel this request");
                }
            } else if (newStatus == RequestStatus.COMPLETED) {
                if (!isRequester && !isAssignedDonor) {
                    throw new UnauthorizedException("Only the requester, donor, or an admin can mark this request as completed");
                }
            }
        }

        bloodRequest.setStatus(newStatus);

        // If request is completed and donor is assigned, increment total donations count and update last donation date
        if (newStatus == RequestStatus.COMPLETED && bloodRequest.getDonor() != null) {
            Donor donor = bloodRequest.getDonor();
            donor.setTotalDonations(donor.getTotalDonations() + 1);
            donor.setLastDonationDate(LocalDate.now());
            donorRepository.save(donor);
            log.info("Donor {} donation count incremented to {}", donor.getId(), donor.getTotalDonations());
        }

        BloodRequest updatedRequest = bloodRequestRepository.save(bloodRequest);
        log.info("Blood request {} status updated to {}", requestId, newStatus);

        return mapToResponse(updatedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BloodRequestResponse> getSentRequests(Long requesterId) {
        log.info("Fetching sent blood requests for requester id: {}", requesterId);
        return bloodRequestRepository.findByRequesterIdOrderByCreatedAtDesc(requesterId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BloodRequestResponse> getReceivedRequests(Long userId) {
        log.info("Fetching received blood requests for user id: {}", userId);
        Optional<Donor> donorOpt = donorRepository.findByUserId(userId);
        if (donorOpt.isEmpty()) {
            return List.of();
        }
        return bloodRequestRepository.findByDonorIdOrderByCreatedAtDesc(donorOpt.get().getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BloodRequestResponse getRequestById(Long requestId) {
        BloodRequest bloodRequest = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BloodRequest", "id", requestId));
        return mapToResponse(bloodRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BloodRequestResponse> getAllRequests() {
        return bloodRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelRequest(Long userId, Long requestId) {
        BloodRequestStatusUpdateDto cancelDto = new BloodRequestStatusUpdateDto(RequestStatus.CANCELLED);
        updateRequestStatus(userId, requestId, cancelDto);
    }

    private BloodRequestResponse mapToResponse(BloodRequest request) {
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
