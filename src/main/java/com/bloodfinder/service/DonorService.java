package com.bloodfinder.service;

import com.bloodfinder.dto.request.DonorRegisterRequest;
import com.bloodfinder.dto.request.DonorUpdateRequest;
import com.bloodfinder.dto.response.DonorResponse;
import com.bloodfinder.entity.enums.AvailabilityStatus;
import com.bloodfinder.entity.enums.BloodGroup;

import java.util.List;
import java.util.Map;

public interface DonorService {

    DonorResponse registerDonor(Long userId, DonorRegisterRequest request);

    DonorResponse updateDonor(Long userId, DonorUpdateRequest request);

    DonorResponse toggleAvailability(Long userId);

    DonorResponse getDonorByUserId(Long userId);

    DonorResponse getDonorById(Long donorId);

    List<DonorResponse> searchDonors(BloodGroup bloodGroup, String country, String state, String district, String mandal, String village, String city, AvailabilityStatus availability);

    List<DonorResponse> getAvailableDonors();

    Map<String, Long> getBloodGroupDistribution();
}
