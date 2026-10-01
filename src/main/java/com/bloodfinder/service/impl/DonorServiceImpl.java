package com.bloodfinder.service.impl;

import com.bloodfinder.dto.request.DonorRegisterRequest;
import com.bloodfinder.dto.request.DonorUpdateRequest;
import com.bloodfinder.dto.response.DonorResponse;
import com.bloodfinder.entity.Donor;
import com.bloodfinder.entity.User;
import com.bloodfinder.entity.enums.AvailabilityStatus;
import com.bloodfinder.entity.enums.BloodGroup;
import com.bloodfinder.entity.enums.Role;
import com.bloodfinder.exception.BadRequestException;
import com.bloodfinder.exception.DuplicateResourceException;
import com.bloodfinder.exception.ResourceNotFoundException;
import com.bloodfinder.repository.DonorRepository;
import com.bloodfinder.repository.UserRepository;
import com.bloodfinder.service.DonorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonorServiceImpl implements DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public DonorResponse registerDonor(Long userId, DonorRegisterRequest request) {
        log.info("Registering user {} as blood donor", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (donorRepository.existsByUserId(userId)) {
            throw new DuplicateResourceException("This account is already registered as a blood donor");
        }

        AvailabilityStatus initialStatus = request.getAvailabilityStatus() != null 
                ? request.getAvailabilityStatus() 
                : AvailabilityStatus.AVAILABLE;

        Donor donor = Donor.builder()
                .user(user)
                .bloodGroup(request.getBloodGroup())
                .country(request.getCountry() != null && !request.getCountry().trim().isEmpty() ? request.getCountry().trim() : "India")
                .state(request.getState() != null ? request.getState().trim() : null)
                .district(request.getDistrict() != null ? request.getDistrict().trim() : null)
                .mandal(request.getMandal() != null ? request.getMandal().trim() : null)
                .village(request.getVillage() != null ? request.getVillage().trim() : null)
                .city(request.getCity() != null ? request.getCity().trim() : "")
                .address(request.getAddress() != null ? request.getAddress().trim() : null)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .contactNumber(request.getContactNumber().trim())
                .lastDonationDate(request.getLastDonationDate())
                .availabilityStatus(initialStatus)
                .totalDonations(0)
                .build();

        // If user is ROLE_USER, promote them to ROLE_DONOR
        if (user.getRole() == Role.ROLE_USER) {
            user.setRole(Role.ROLE_DONOR);
            userRepository.save(user);
        }

        Donor savedDonor = donorRepository.save(donor);
        log.info("Donor registered successfully with id: {}", savedDonor.getId());

        return mapToResponse(savedDonor);
    }

    @Override
    @Transactional
    public DonorResponse updateDonor(Long userId, DonorUpdateRequest request) {
        log.info("Updating donor details for userId: {}", userId);

        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for current user"));

        donor.setBloodGroup(request.getBloodGroup());
        if (request.getCountry() != null && !request.getCountry().trim().isEmpty()) {
            donor.setCountry(request.getCountry().trim());
        }
        donor.setState(request.getState() != null ? request.getState().trim() : null);
        donor.setDistrict(request.getDistrict() != null ? request.getDistrict().trim() : null);
        donor.setMandal(request.getMandal() != null ? request.getMandal().trim() : null);
        donor.setVillage(request.getVillage() != null ? request.getVillage().trim() : null);
        donor.setCity(request.getCity() != null ? request.getCity().trim() : donor.getCity());
        donor.setAddress(request.getAddress() != null ? request.getAddress().trim() : null);
        donor.setLatitude(request.getLatitude());
        donor.setLongitude(request.getLongitude());
        donor.setContactNumber(request.getContactNumber().trim());
        donor.setLastDonationDate(request.getLastDonationDate());
        donor.setAvailabilityStatus(request.getAvailabilityStatus());

        Donor updatedDonor = donorRepository.save(donor);
        log.info("Donor profile {} updated successfully", updatedDonor.getId());

        return mapToResponse(updatedDonor);
    }

    @Override
    @Transactional
    public DonorResponse toggleAvailability(Long userId) {
        log.info("Toggling availability status for userId: {}", userId);

        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for current user"));

        AvailabilityStatus newStatus = donor.getAvailabilityStatus() == AvailabilityStatus.AVAILABLE
                ? AvailabilityStatus.UNAVAILABLE
                : AvailabilityStatus.AVAILABLE;

        donor.setAvailabilityStatus(newStatus);
        Donor savedDonor = donorRepository.save(donor);
        log.info("Donor {} availability toggled to {}", savedDonor.getId(), newStatus);

        return mapToResponse(savedDonor);
    }

    @Override
    @Transactional(readOnly = true)
    public DonorResponse getDonorByUserId(Long userId) {
        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user id: " + userId));
        return mapToResponse(donor);
    }

    @Override
    @Transactional(readOnly = true)
    public DonorResponse getDonorById(Long donorId) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor", "id", donorId));
        return mapToResponse(donor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonorResponse> searchDonors(BloodGroup bloodGroup, String country, String state, String district, String mandal, String village, String city, AvailabilityStatus availability) {
        String sanitizedCountry = (country != null && !country.trim().isEmpty()) ? country.trim() : null;
        String sanitizedState = (state != null && !state.trim().isEmpty()) ? state.trim() : null;
        String sanitizedDistrict = (district != null && !district.trim().isEmpty()) ? district.trim() : null;
        String sanitizedMandal = (mandal != null && !mandal.trim().isEmpty()) ? mandal.trim() : null;
        String sanitizedVillage = (village != null && !village.trim().isEmpty()) ? village.trim() : null;
        String sanitizedCity = (city != null && !city.trim().isEmpty()) ? city.trim() : null;

        log.info("Searching donors with criteria - bloodGroup: {}, country: {}, state: {}, district: {}, mandal: {}, village: {}, city: {}, availability: {}", 
                bloodGroup, sanitizedCountry, sanitizedState, sanitizedDistrict, sanitizedMandal, sanitizedVillage, sanitizedCity, availability);

        List<Donor> donors = donorRepository.searchDonors(bloodGroup, sanitizedCountry, sanitizedState, sanitizedDistrict, sanitizedMandal, sanitizedVillage, sanitizedCity, availability);
        return donors.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonorResponse> getAvailableDonors() {
        return searchDonors(null, null, null, null, null, null, null, AvailabilityStatus.AVAILABLE);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getBloodGroupDistribution() {
        Map<String, Long> stats = new EnumMap<>(BloodGroup.class).keySet().stream().collect(Collectors.toMap(
                BloodGroup::getDisplayName,
                bg -> 0L
        ));

        // Fill all 8 blood groups with default 0
        for (BloodGroup bg : BloodGroup.values()) {
            stats.put(bg.getDisplayName(), 0L);
        }

        List<Object[]> results = donorRepository.countDonorsByBloodGroup();
        for (Object[] row : results) {
            BloodGroup bg = (BloodGroup) row[0];
            Long count = (Long) row[1];
            if (bg != null) {
                stats.put(bg.getDisplayName(), count);
            }
        }
        return stats;
    }

    private DonorResponse mapToResponse(Donor donor) {
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
                .mandal(donor.getMandal())
                .village(donor.getVillage())
                .city(donor.getCity())
                .address(donor.getAddress())
                .latitude(donor.getLatitude())
                .longitude(donor.getLongitude())
                .contactNumber(donor.getContactNumber())
                .lastDonationDate(donor.getLastDonationDate())
                .availabilityStatus(donor.getAvailabilityStatus())
                .totalDonations(donor.getTotalDonations())
                .createdAt(donor.getCreatedAt())
                .build();
    }
}
