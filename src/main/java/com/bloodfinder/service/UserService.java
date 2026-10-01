package com.bloodfinder.service;

import com.bloodfinder.dto.request.ChangePasswordRequest;
import com.bloodfinder.dto.request.UserUpdateRequest;
import com.bloodfinder.dto.response.UserProfileResponse;
import com.bloodfinder.entity.User;

public interface UserService {

    UserProfileResponse getProfile(Long userId);

    UserProfileResponse updateProfile(Long userId, UserUpdateRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);

    User findUserById(Long userId);
}
