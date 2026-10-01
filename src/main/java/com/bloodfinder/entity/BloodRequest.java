package com.bloodfinder.entity;

import com.bloodfinder.entity.enums.BloodGroup;
import com.bloodfinder.entity.enums.RequestStatus;
import com.bloodfinder.entity.enums.UrgencyLevel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests", indexes = {
    @Index(name = "idx_request_blood_group", columnList = "blood_group"),
    @Index(name = "idx_request_city", columnList = "city"),
    @Index(name = "idx_request_status", columnList = "status"),
    @Index(name = "idx_request_requester", columnList = "requester_id"),
    @Index(name = "idx_request_donor", columnList = "donor_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id")
    private Donor donor;

    @Column(name = "patient_name", nullable = false, length = 100)
    private String patientName;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false, length = 20)
    private BloodGroup bloodGroup;

    @Column(name = "hospital_name", nullable = false, length = 150)
    private String hospitalName;

    @Column(name = "hospital_address", length = 255)
    private String hospitalAddress;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;

    @Column(name = "required_units", nullable = false)
    @Builder.Default
    private Integer requiredUnits = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_level", nullable = false, length = 20)
    @Builder.Default
    private UrgencyLevel urgencyLevel = UrgencyLevel.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "additional_notes", length = 500)
    private String additionalNotes;

    @Column(name = "needed_before")
    private LocalDate neededBefore;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
