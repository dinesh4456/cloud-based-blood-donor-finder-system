package com.bloodfinder.dto.response;

import com.bloodfinder.entity.enums.BloodGroup;
import com.bloodfinder.entity.enums.RequestStatus;
import com.bloodfinder.entity.enums.UrgencyLevel;
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
public class BloodRequestResponse {

    private Long id;
    private Long requesterId;
    private String requesterName;
    private String requesterEmail;
    private String requesterPhone;

    private Long donorId;
    private String donorName;
    private String donorPhone;

    private String patientName;
    private BloodGroup bloodGroup;
    private String bloodGroupDisplay;
    private String hospitalName;
    private String hospitalAddress;
    private String city;
    private String contactNumber;
    private Integer requiredUnits;
    private UrgencyLevel urgencyLevel;
    private RequestStatus status;
    private String additionalNotes;
    private LocalDate neededBefore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
