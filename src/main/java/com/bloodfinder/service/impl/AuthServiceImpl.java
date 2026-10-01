package com.bloodfinder.service.impl;

import com.bloodfinder.dto.request.LoginRequest;
import com.bloodfinder.dto.request.RegisterRequest;
import com.bloodfinder.dto.response.AuthResponse;
import com.bloodfinder.entity.Donor;
import com.bloodfinder.entity.User;
import com.bloodfinder.entity.enums.Role;
import com.bloodfinder.entity.enums.UserStatus;
import com.bloodfinder.exception.BadRequestException;
import com.bloodfinder.exception.DuplicateResourceException;
import com.bloodfinder.repository.DonorRepository;
import com.bloodfinder.repository.UserRepository;
import com.bloodfinder.security.JwtTokenProvider;
import com.bloodfinder.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        log.info("Attempting login for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (user.getStatus() == UserStatus.BLOCKED) {
            log.warn("Blocked user {} attempted to log in", email);
            throw new BadRequestException("Your account has been deactivated or blocked by an administrator. Please contact support.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = tokenProvider.generateToken(authentication);

            Optional<Donor> donorOpt = donorRepository.findByUserId(user.getId());
            boolean isDonor = donorOpt.isPresent();
            Long donorId = donorOpt.map(Donor::getId).orElse(null);

            log.info("User {} successfully authenticated", email);

            return AuthResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .role(user.getRole())
                    .status(user.getStatus())
                    .isDonor(isDonor)
                    .donorId(donorId)
                    .build();

        } catch (BadCredentialsException ex) {
            log.warn("Failed login attempt for email: {}", email);
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        log.info("Attempting registration for email: {}", email);

        if (userRepository.existsByEmail(email)) {
            log.warn("Registration rejected - email {} already registered", email);
            throw new DuplicateResourceException("An account with email " + email + " already exists");
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.ROLE_USER;
        // Never allow public registration to assign ROLE_ADMIN
        if (assignedRole == Role.ROLE_ADMIN) {
            assignedRole = Role.ROLE_USER;
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone().trim())
                .role(assignedRole)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered successfully: id={}, email={}, role={}", savedUser.getId(), savedUser.getEmail(), savedUser.getRole());

        String token = tokenProvider.generateTokenForUser(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole())
                .status(savedUser.getStatus())
                .isDonor(false)
                .donorId(null)
                .build();
    }
}
