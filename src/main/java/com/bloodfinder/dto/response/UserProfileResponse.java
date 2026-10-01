package com.bloodfinder.dto.response;

import com.bloodfinder.entity.enums.Role;
import com.bloodfinder.entity.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private UserStatus status;
    private boolean isDonor;
    private DonorResponse donorDetails;
    private LocalDateTime createdAt;
}
