package com.bloodfinder.config;

import com.bloodfinder.entity.BloodRequest;
import com.bloodfinder.entity.Donor;
import com.bloodfinder.entity.User;
import com.bloodfinder.entity.enums.*;
import com.bloodfinder.repository.BloodRequestRepository;
import com.bloodfinder.repository.DonorRepository;
import com.bloodfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed-data:false}")
    private boolean seedDataEnabled;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking database initialization status (seed-data enabled: {})...", seedDataEnabled);

        // 1. Seed Admin Account if not exists
        if (!userRepository.existsByEmail("admin@bloodfinder.com")) {
            log.info("Seeding default administrator account...");
            User admin = User.builder()
                    .name("System Administrator")
                    .email("admin@bloodfinder.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("+1-555-0100")
                    .role(Role.ROLE_ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
            log.info("Default Admin created: admin@bloodfinder.com / Admin@123");
        }

        // In production or when seedData is disabled, purge any mock demo donors from the database
        if (!seedDataEnabled) {
            log.info("Production mode active (app.seed-data=false). Purging any mock sample donor records...");
            purgeDemoRecords();
            log.info("Production database clean: Only verified live users and donors will be listed.");
            return;
        }

        // 2. Seed Sample Donors & Users if database is empty of donors
        if (donorRepository.count() == 0) {
            log.info("Seeding initial realistic blood donors and users...");

            // Donor 1 - O+ in Mumbai
            User user1 = User.builder()
                    .name("Rahul Sharma")
                    .email("rahul.sharma@example.com")
                    .password(passwordEncoder.encode("Donor@123"))
                    .phone("+91-9876543210")
                    .role(Role.ROLE_DONOR)
                    .status(UserStatus.ACTIVE)
                    .build();
            user1 = userRepository.save(user1);

            Donor donor1 = Donor.builder()
                    .user(user1)
                    .bloodGroup(BloodGroup.O_POSITIVE)
                    .country("India")
                    .state("Maharashtra")
                    .district("Mumbai Suburban")
                    .mandal("Andheri")
                    .village("Andheri West")
                    .city("Mumbai")
                    .address("Andheri West, Link Road")
                    .contactNumber("+91-9876543210")
                    .latitude(19.1136)
                    .longitude(72.8697)
                    .lastDonationDate(LocalDate.now().minusMonths(4))
                    .availabilityStatus(AvailabilityStatus.AVAILABLE)
                    .totalDonations(5)
                    .build();
            donor1 = donorRepository.save(donor1);

            // Donor 2 - A+ in Delhi
            User user2 = User.builder()
                    .name("Priya Patel")
                    .email("priya.patel@example.com")
                    .password(passwordEncoder.encode("Donor@123"))
                    .phone("+91-9876543211")
                    .role(Role.ROLE_DONOR)
                    .status(UserStatus.ACTIVE)
                    .build();
            user2 = userRepository.save(user2);

            Donor donor2 = Donor.builder()
                    .user(user2)
                    .bloodGroup(BloodGroup.A_POSITIVE)
                    .country("India")
                    .state("Delhi")
                    .district("Central Delhi")
                    .mandal("Connaught Place")
                    .village("Janpath")
                    .city("Delhi")
                    .address("Connaught Place, Central Delhi")
                    .contactNumber("+91-9876543211")
                    .latitude(28.6315)
                    .longitude(77.2167)
                    .lastDonationDate(LocalDate.now().minusMonths(2))
                    .availabilityStatus(AvailabilityStatus.AVAILABLE)
                    .totalDonations(3)
                    .build();
            donor2 = donorRepository.save(donor2);

            // Donor 3 - B+ in Bangalore
            User user3 = User.builder()
                    .name("Amit Verma")
                    .email("amit.verma@example.com")
                    .password(passwordEncoder.encode("Donor@123"))
                    .phone("+91-9876543212")
                    .role(Role.ROLE_DONOR)
                    .status(UserStatus.ACTIVE)
                    .build();
            user3 = userRepository.save(user3);

            Donor donor3 = Donor.builder()
                    .user(user3)
                    .bloodGroup(BloodGroup.B_POSITIVE)
                    .country("India")
                    .state("Karnataka")
                    .district("Bangalore Urban")
                    .mandal("Bangalore South")
                    .village("Koramangala")
                    .city("Bangalore")
                    .address("Koramangala, 5th Block")
                    .contactNumber("+91-9876543212")
                    .latitude(12.9352)
                    .longitude(77.6245)
                    .lastDonationDate(LocalDate.now().minusMonths(6))
                    .availabilityStatus(AvailabilityStatus.AVAILABLE)
                    .totalDonations(8)
                    .build();
            donorRepository.save(donor3);

            // Donor 4 - AB+ in Hyderabad
            User user4 = User.builder()
                    .name("Sneha Reddy")
                    .email("sneha.reddy@example.com")
                    .password(passwordEncoder.encode("Donor@123"))
                    .phone("+91-9876543213")
                    .role(Role.ROLE_DONOR)
                    .status(UserStatus.ACTIVE)
                    .build();
            user4 = userRepository.save(user4);

            Donor donor4 = Donor.builder()
                    .user(user4)
                    .bloodGroup(BloodGroup.AB_POSITIVE)
                    .country("India")
                    .state("Telangana")
                    .district("Hyderabad")
                    .mandal("Shaikpet")
                    .village("Madhapur")
                    .city("Hyderabad")
                    .address("Hitec City, Madhapur")
                    .contactNumber("+91-9876543213")
                    .latitude(17.4483)
                    .longitude(78.3915)
                    .lastDonationDate(LocalDate.now().minusMonths(3))
                    .availabilityStatus(AvailabilityStatus.AVAILABLE)
                    .totalDonations(2)
                    .build();
            donorRepository.save(donor4);

            // Donor 5 - O- (Universal Donor) in Mumbai
            User user5 = User.builder()
                    .name("Vikram Singh")
                    .email("vikram.singh@example.com")
                    .password(passwordEncoder.encode("Donor@123"))
                    .phone("+91-9876543214")
                    .role(Role.ROLE_DONOR)
                    .status(UserStatus.ACTIVE)
                    .build();
            user5 = userRepository.save(user5);

            Donor donor5 = Donor.builder()
                    .user(user5)
                    .bloodGroup(BloodGroup.O_NEGATIVE)
                    .country("India")
                    .state("Maharashtra")
                    .district("Mumbai Suburban")
                    .mandal("Bandra")
                    .village("Bandra West")
                    .city("Mumbai")
                    .address("Bandra West, Hill Road")
                    .contactNumber("+91-9876543214")
                    .latitude(19.0596)
                    .longitude(72.8295)
                    .lastDonationDate(LocalDate.now().minusMonths(1))
                    .availabilityStatus(AvailabilityStatus.AVAILABLE)
                    .totalDonations(12)
                    .build();
            donorRepository.save(donor5);

            // Donor 6 - B- in Pune
            User user6 = User.builder()
                    .name("Ananya Das")
                    .email("ananya.das@example.com")
                    .password(passwordEncoder.encode("Donor@123"))
                    .phone("+91-9876543215")
                    .role(Role.ROLE_DONOR)
                    .status(UserStatus.ACTIVE)
                    .build();
            user6 = userRepository.save(user6);

            Donor donor6 = Donor.builder()
                    .user(user6)
                    .bloodGroup(BloodGroup.B_NEGATIVE)
                    .country("India")
                    .state("Maharashtra")
                    .district("Pune")
                    .mandal("Haveli")
                    .village("Kothrud")
                    .city("Pune")
                    .address("Kothrud, Paud Road")
                    .contactNumber("+91-9876543215")
                    .latitude(18.5074)
                    .longitude(73.8077)
                    .lastDonationDate(LocalDate.now().minusMonths(5))
                    .availabilityStatus(AvailabilityStatus.AVAILABLE)
                    .totalDonations(4)
                    .build();
            donorRepository.save(donor6);

            // Regular User (Recipient)
            User recipient = User.builder()
                    .name("John Doe")
                    .email("john.doe@example.com")
                    .password(passwordEncoder.encode("User@123"))
                    .phone("+91-9876543220")
                    .role(Role.ROLE_USER)
                    .status(UserStatus.ACTIVE)
                    .build();
            recipient = userRepository.save(recipient);

            // 3. Seed Sample Blood Requests
            if (bloodRequestRepository.count() == 0) {
                // Request 1: Open Emergency Request
                BloodRequest req1 = BloodRequest.builder()
                        .requester(recipient)
                        .donor(null)
                        .patientName("Ramesh Gupta")
                        .bloodGroup(BloodGroup.O_POSITIVE)
                        .hospitalName("Lilavati Hospital & Research Centre")
                        .hospitalAddress("Bandra Reclamation, Mumbai")
                        .city("Mumbai")
                        .contactNumber("+91-9876543220")
                        .requiredUnits(2)
                        .urgencyLevel(UrgencyLevel.CRITICAL)
                        .status(RequestStatus.PENDING)
                        .additionalNotes("Emergency heart surgery scheduled. Urgent requirement of 2 units O+ blood.")
                        .neededBefore(LocalDate.now().plusDays(2))
                        .build();
                bloodRequestRepository.save(req1);

                // Request 2: Directed Request to Donor 2 (Priya Patel)
                BloodRequest req2 = BloodRequest.builder()
                        .requester(recipient)
                        .donor(donor2)
                        .patientName("Kavita Sen")
                        .bloodGroup(BloodGroup.A_POSITIVE)
                        .hospitalName("AIIMS Hospital")
                        .hospitalAddress("Ansari Nagar, New Delhi")
                        .city("Delhi")
                        .contactNumber("+91-9876543220")
                        .requiredUnits(1)
                        .urgencyLevel(UrgencyLevel.HIGH)
                        .status(RequestStatus.ACCEPTED)
                        .additionalNotes("Platelet requirement for dengue recovery.")
                        .neededBefore(LocalDate.now().plusDays(3))
                        .build();
                bloodRequestRepository.save(req2);

                // Request 3: Directed Request to Donor 1 (Rahul Sharma) - Completed
                BloodRequest req3 = BloodRequest.builder()
                        .requester(recipient)
                        .donor(donor1)
                        .patientName("Sunil Mehta")
                        .bloodGroup(BloodGroup.O_POSITIVE)
                        .hospitalName("Kokilaben Dhirubhai Ambani Hospital")
                        .hospitalAddress("Four Bungalows, Andheri West, Mumbai")
                        .city("Mumbai")
                        .contactNumber("+91-9876543220")
                        .requiredUnits(1)
                        .urgencyLevel(UrgencyLevel.MEDIUM)
                        .status(RequestStatus.COMPLETED)
                        .additionalNotes("Orthopedic surgery recovery - successfully fulfilled.")
                        .neededBefore(LocalDate.now().minusDays(10))
                        .build();
                bloodRequestRepository.save(req3);
            }

            log.info("Database initialized with realistic sample donors, users, and requests successfully.");
        } else {
            // Ensure existing donors have country, district, mandal, village populated
            donorRepository.findAll().forEach(d -> {
                boolean modified = false;
                if (d.getCountry() == null || d.getCountry().isEmpty()) {
                    d.setCountry("India");
                    modified = true;
                }
                if (d.getDistrict() == null || d.getDistrict().isEmpty()) {
                    if ("Mumbai".equalsIgnoreCase(d.getCity())) d.setDistrict("Mumbai Suburban");
                    else if ("Delhi".equalsIgnoreCase(d.getCity())) d.setDistrict("Central Delhi");
                    else if ("Bangalore".equalsIgnoreCase(d.getCity())) d.setDistrict("Bangalore Urban");
                    else if ("Hyderabad".equalsIgnoreCase(d.getCity())) d.setDistrict("Hyderabad");
                    else if ("Pune".equalsIgnoreCase(d.getCity())) d.setDistrict("Pune");
                    else d.setDistrict(d.getCity());
                    modified = true;
                }
                if (d.getMandal() == null || d.getMandal().isEmpty()) {
                    if ("Mumbai".equalsIgnoreCase(d.getCity())) d.setMandal("Andheri");
                    else if ("Delhi".equalsIgnoreCase(d.getCity())) d.setMandal("Connaught Place");
                    else if ("Bangalore".equalsIgnoreCase(d.getCity())) d.setMandal("Bangalore South");
                    else if ("Hyderabad".equalsIgnoreCase(d.getCity())) d.setMandal("Shaikpet");
                    else if ("Pune".equalsIgnoreCase(d.getCity())) d.setMandal("Haveli");
                    else d.setMandal("Central Mandal");
                    modified = true;
                }
                if (d.getVillage() == null || d.getVillage().isEmpty()) {
                    if ("Mumbai".equalsIgnoreCase(d.getCity())) d.setVillage("Andheri West");
                    else if ("Delhi".equalsIgnoreCase(d.getCity())) d.setVillage("Janpath");
                    else if ("Bangalore".equalsIgnoreCase(d.getCity())) d.setVillage("Koramangala");
                    else if ("Hyderabad".equalsIgnoreCase(d.getCity())) d.setVillage("Madhapur");
                    else if ("Pune".equalsIgnoreCase(d.getCity())) d.setVillage("Kothrud");
                    else d.setVillage(d.getCity());
                    modified = true;
                }
                if (d.getLatitude() == null || d.getLongitude() == null) {
                    if ("Mumbai".equalsIgnoreCase(d.getCity())) {
                        if ("Bandra".equalsIgnoreCase(d.getMandal()) || "Bandra West".equalsIgnoreCase(d.getVillage())) {
                            d.setLatitude(19.0596); d.setLongitude(72.8295);
                        } else {
                            d.setLatitude(19.1136); d.setLongitude(72.8697);
                        }
                    } else if ("Delhi".equalsIgnoreCase(d.getCity())) {
                        d.setLatitude(28.6315); d.setLongitude(77.2167);
                    } else if ("Bangalore".equalsIgnoreCase(d.getCity()) || "Bengaluru".equalsIgnoreCase(d.getCity())) {
                        d.setLatitude(12.9352); d.setLongitude(77.6245);
                    } else if ("Hyderabad".equalsIgnoreCase(d.getCity())) {
                        d.setLatitude(17.4483); d.setLongitude(78.3915);
                    } else if ("Pune".equalsIgnoreCase(d.getCity())) {
                        d.setLatitude(18.5074); d.setLongitude(73.8077);
                    } else {
                        d.setLatitude(20.5937); d.setLongitude(78.9629);
                    }
                    modified = true;
                }
                if (modified) {
                    donorRepository.save(d);
                }
            });
        }
    }

    /**
     * Purges mock demo donor accounts and demo blood requests from the production database.
     */
    private void purgeDemoRecords() {
        java.util.List<String> demoEmails = java.util.List.of(
            "rahul.sharma@example.com",
            "priya.patel@example.com",
            "amit.verma@example.com",
            "sneha.reddy@example.com",
            "vikram.singh@example.com",
            "ananya.das@example.com",
            "john.doe@example.com"
        );

        for (String email : demoEmails) {
            userRepository.findByEmail(email).ifPresent(user -> {
                donorRepository.findByUserId(user.getId()).ifPresent(donor -> {
                    bloodRequestRepository.findAll().forEach(req -> {
                        if (donor.equals(req.getDonor()) || user.equals(req.getRequester())) {
                            bloodRequestRepository.delete(req);
                        }
                    });
                    donorRepository.delete(donor);
                    log.info("Purged demo donor: {} ({})", user.getName(), email);
                });
                bloodRequestRepository.findAll().forEach(req -> {
                    if (user.equals(req.getRequester())) {
                        bloodRequestRepository.delete(req);
                    }
                });
                userRepository.delete(user);
                log.info("Purged demo account: {}", email);
            });
        }
    }
}
