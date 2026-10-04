package com.bloodfinder.repository;

import com.bloodfinder.entity.Donor;
import com.bloodfinder.entity.enums.AvailabilityStatus;
import com.bloodfinder.entity.enums.BloodGroup;
import com.bloodfinder.entity.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {

    Optional<Donor> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    long countByAvailabilityStatus(AvailabilityStatus status);

    @Query("SELECT d FROM Donor d WHERE d.user.status = :userStatus ORDER BY d.createdAt DESC")
    List<Donor> findAllActiveDonors(@Param("userStatus") UserStatus userStatus);

    @Query("SELECT d FROM Donor d WHERE d.user.status = 'ACTIVE' " +
           "AND (:bloodGroup IS NULL OR d.bloodGroup = :bloodGroup) " +
           "AND (:country IS NULL OR LOWER(d.country) LIKE LOWER(CONCAT('%', :country, '%'))) " +
           "AND (:state IS NULL OR LOWER(d.state) LIKE LOWER(CONCAT('%', :state, '%'))) " +
           "AND (:district IS NULL OR LOWER(d.district) LIKE LOWER(CONCAT('%', :district, '%'))) " +
           "AND (:mandal IS NULL OR LOWER(d.mandal) LIKE LOWER(CONCAT('%', :mandal, '%'))) " +
           "AND (:village IS NULL OR LOWER(d.village) LIKE LOWER(CONCAT('%', :village, '%'))) " +
           "AND (:city IS NULL OR (" +
           "     LOWER(d.city) LIKE LOWER(CONCAT('%', :city, '%')) OR " +
           "     LOWER(d.village) LIKE LOWER(CONCAT('%', :city, '%')) OR " +
           "     LOWER(d.mandal) LIKE LOWER(CONCAT('%', :city, '%')) OR " +
           "     LOWER(d.district) LIKE LOWER(CONCAT('%', :city, '%')) OR " +
           "     LOWER(d.address) LIKE LOWER(CONCAT('%', :city, '%'))" +
           ")) " +
           "AND (:availability IS NULL OR d.availabilityStatus = :availability) " +
           "ORDER BY d.availabilityStatus ASC, d.createdAt DESC")
    List<Donor> searchDonors(
            @Param("bloodGroup") BloodGroup bloodGroup,
            @Param("country") String country,
            @Param("state") String state,
            @Param("district") String district,
            @Param("mandal") String mandal,
            @Param("village") String village,
            @Param("city") String city,
            @Param("availability") AvailabilityStatus availability);

    @Query("SELECT d.bloodGroup, COUNT(d) FROM Donor d WHERE d.user.status = 'ACTIVE' GROUP BY d.bloodGroup")
    List<Object[]> countDonorsByBloodGroup();

    List<Donor> findAllByOrderByCreatedAtDesc();
}
