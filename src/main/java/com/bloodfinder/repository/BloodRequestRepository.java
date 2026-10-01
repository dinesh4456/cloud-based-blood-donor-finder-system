package com.bloodfinder.repository;

import com.bloodfinder.entity.BloodRequest;
import com.bloodfinder.entity.enums.BloodGroup;
import com.bloodfinder.entity.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    List<BloodRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);

    List<BloodRequest> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    List<BloodRequest> findByDonorUserIdOrderByCreatedAtDesc(Long donorUserId);

    List<BloodRequest> findByStatus(RequestStatus status);

    long countByStatus(RequestStatus status);

    @Query("SELECT br FROM BloodRequest br WHERE " +
           "(:bloodGroup IS NULL OR br.bloodGroup = :bloodGroup) AND " +
           "(:city IS NULL OR LOWER(br.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:status IS NULL OR br.status = :status) " +
           "ORDER BY br.createdAt DESC")
    List<BloodRequest> searchRequests(
            @Param("bloodGroup") BloodGroup bloodGroup,
            @Param("city") String city,
            @Param("status") RequestStatus status);

    List<BloodRequest> findAllByOrderByCreatedAtDesc();
}
