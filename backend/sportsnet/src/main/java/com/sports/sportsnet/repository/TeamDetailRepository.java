
package com.sports.sportsnet.repository;

import com.sports.sportsnet.entity.TeamDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamDetailRepository extends JpaRepository<TeamDetail, UUID> {
    List<TeamDetail> findByUser_UserId(UUID userId);
    Optional<TeamDetail> findByIdAndUser_UserId(UUID id, UUID userId);
}