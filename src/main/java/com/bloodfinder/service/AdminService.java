package com.bloodfinder.service;

import com.bloodfinder.dto.response.BloodRequestResponse;
import com.bloodfinder.dto.response.DashboardStatsResponse;
import com.bloodfinder.dto.response.DonorResponse;
import com.bloodfinder.dto.response.UserProfileResponse;
import com.bloodfinder.entity.enums.UserStatus;

import java.util.List;

public interface AdminService {

    DashboardStatsResponse getDashboardStats();

    List<UserProfileResponse> getAllUsers();

    UserProfileResponse updateUserStatus(Long userId, UserStatus status);

    List<DonorResponse> getAllDonors();

    List<BloodRequestResponse> getAllBloodRequests();
}
