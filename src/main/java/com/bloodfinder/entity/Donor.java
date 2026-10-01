package com.bloodfinder.entity;

import com.bloodfinder.entity.enums.AvailabilityStatus;
import com.bloodfinder.entity.enums.BloodGroup;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donors", indexes = {
    @Index(name = "idx_donor_blood_group", columnList = "blood_group"),
    @Index(name = "idx_donor_city", columnList = "city"),
    @Index(name = "idx_donor_availability", columnList = "availability_status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false, length = 20)
    private BloodGroup bloodGroup;

    @Column(length = 100)
    @Builder.Default
    private String country = "India";

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String mandal;

    @Column(length = 100)
    private String village;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(length = 255)
    private String address;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false, length = 20)
    @Builder.Default
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @Column(name = "total_donations", nullable = false)
    @Builder.Default
    private Integer totalDonations = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
