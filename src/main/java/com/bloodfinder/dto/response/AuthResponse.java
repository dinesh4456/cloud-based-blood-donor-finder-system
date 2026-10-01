package com.bloodfinder.dto.response;

import com.bloodfinder.entity.enums.Role;
import com.bloodfinder.entity.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private UserStatus status;
    private boolean isDonor;
    private Long donorId;
}
