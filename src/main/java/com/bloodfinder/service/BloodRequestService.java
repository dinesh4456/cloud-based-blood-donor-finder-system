package com.bloodfinder.service;

import com.bloodfinder.dto.request.BloodRequestCreateDto;
import com.bloodfinder.dto.request.BloodRequestStatusUpdateDto;
import com.bloodfinder.dto.response.BloodRequestResponse;

import java.util.List;

public interface BloodRequestService {

    BloodRequestResponse createRequest(Long requesterId, BloodRequestCreateDto requestDto);

    BloodRequestResponse updateRequestStatus(Long userId, Long requestId, BloodRequestStatusUpdateDto statusDto);

    List<BloodRequestResponse> getSentRequests(Long requesterId);

    List<BloodRequestResponse> getReceivedRequests(Long userId);

    BloodRequestResponse getRequestById(Long requestId);

    List<BloodRequestResponse> getAllRequests();

    void cancelRequest(Long userId, Long requestId);
}
