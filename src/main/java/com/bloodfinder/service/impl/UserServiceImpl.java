package com.bloodfinder.service.impl;

import com.bloodfinder.dto.request.ChangePasswordRequest;
import com.bloodfinder.dto.request.UserUpdateRequest;
import com.bloodfinder.dto.response.DonorResponse;
import com.bloodfinder.dto.response.UserProfileResponse;
import com.bloodfinder.entity.Donor;
import com.bloodfinder.entity.User;
import com.bloodfinder.exception.BadRequestException;
import com.bloodfinder.exception.ResourceNotFoundException;
import com.bloodfinder.repository.DonorRepository;
import com.bloodfinder.repository.UserRepository;
import com.bloodfinder.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        log.info("Fetching user profile for userId: {}", userId);
        User user = findUserById(userId);

        Optional<Donor> donorOpt = donorRepository.findByUserId(userId);
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
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(Long userId, UserUpdateRequest request) {
        log.info("Updating profile for userId: {}", userId);
        User user = findUserById(userId);

        user.setName(request.getName().trim());
        user.setPhone(request.getPhone().trim());

        User updatedUser = userRepository.save(user);

        // Also update contactNumber on donor profile if registered
        Optional<Donor> donorOpt = donorRepository.findByUserId(userId);
        donorOpt.ifPresent(donor -> {
            donor.setContactNumber(updatedUser.getPhone());
            donorRepository.save(donor);
        });

        return getProfile(updatedUser.getId());
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        log.info("Changing password for userId: {}", userId);
        User user = findUserById(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            log.warn("Password change failed: Current password mismatch for user {}", user.getEmail());
            throw new BadRequestException("Current password does not match our records");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BadRequestException("New password cannot be the same as the current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password successfully updated for user {}", user.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
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
}
