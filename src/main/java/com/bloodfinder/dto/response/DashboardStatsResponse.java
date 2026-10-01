package com.bloodfinder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private long totalUsers;
    private long totalDonors;
    private long availableDonors;
    private long unavailableDonors;
    private long totalBloodRequests;
    private long pendingRequests;
    private long acceptedRequests;
    private long completedRequests;
    private long rejectedRequests;
    private Map<String, Long> bloodGroupCounts;
}
