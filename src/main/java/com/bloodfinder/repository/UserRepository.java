package com.bloodfinder.repository;

import com.bloodfinder.entity.User;
import com.bloodfinder.entity.enums.Role;
import com.bloodfinder.entity.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    long countByStatus(UserStatus status);

    List<User> findAllByOrderByCreatedAtDesc();
}
