package com.bloodfinder.dto.request;

import com.bloodfinder.entity.enums.AvailabilityStatus;
import com.bloodfinder.entity.enums.BloodGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonorRegisterRequest {

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    private String country;

    private String state;

    private String district;

    private String mandal;

    private String village;

    @NotBlank(message = "City is required")
    private String city;

    private String profilePhoto;
    private String profileImageUrl;
    private String address;
    private Double latitude;
    private Double longitude;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9+()\\-\\s]{7,20}$", message = "Invalid contact number format")
    private String contactNumber;

    private LocalDate lastDonationDate;

    private AvailabilityStatus availabilityStatus;
}
