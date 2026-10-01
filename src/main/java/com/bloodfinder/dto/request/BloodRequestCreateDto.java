package com.bloodfinder.dto.request;

import com.bloodfinder.entity.enums.BloodGroup;
import com.bloodfinder.entity.enums.UrgencyLevel;
import jakarta.validation.constraints.Min;
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
public class BloodRequestCreateDto {

    private Long donorId; // Optional: can request a specific donor or create an open emergency request

    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    private String hospitalAddress;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9+()\\-\\s]{7,20}$", message = "Invalid contact number format")
    private String contactNumber;

    @NotNull(message = "Required units must be specified")
    @Min(value = 1, message = "At least 1 unit of blood must be requested")
    private Integer requiredUnits;

    private UrgencyLevel urgencyLevel;

    private String additionalNotes;

    private LocalDate neededBefore;
}
