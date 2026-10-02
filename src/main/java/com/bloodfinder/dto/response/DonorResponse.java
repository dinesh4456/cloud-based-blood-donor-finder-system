package com.bloodfinder.dto.response;

import com.bloodfinder.entity.enums.AvailabilityStatus;
import com.bloodfinder.entity.enums.BloodGroup;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonorResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private BloodGroup bloodGroup;
    private String bloodGroupDisplay;
    private String country;
    private String state;
    private String district;
    private String mandal;
    private String village;
    private String city;
    private String address;
    private Double latitude;
    private Double longitude;
    private String profilePhoto;
    private String contactNumber;
    private LocalDate lastDonationDate;
    private AvailabilityStatus availabilityStatus;
    private Integer totalDonations;
    private LocalDateTime createdAt;
}
