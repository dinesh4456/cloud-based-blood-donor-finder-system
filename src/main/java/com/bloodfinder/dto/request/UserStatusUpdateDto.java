package com.bloodfinder.dto.request;

import com.bloodfinder.entity.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatusUpdateDto {

    @NotNull(message = "User status is required")
    private UserStatus status;
}
