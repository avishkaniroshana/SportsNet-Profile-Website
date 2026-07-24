
package com.sports.sportsnet.repository;

import com.sports.sportsnet.entity.EducationalDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EducationalDetailRepository extends JpaRepository<EducationalDetail, UUID> {
    List<EducationalDetail> findByUser_UserId(UUID userId);
    Optional<EducationalDetail> findByIdAndUser_UserId(UUID id, UUID userId);
}