package com.bloodfinder.dto.request;

import com.bloodfinder.entity.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BloodRequestStatusUpdateDto {

    @NotNull(message = "Request status is required")
    private RequestStatus status;
}
