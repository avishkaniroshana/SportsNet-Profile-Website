package com.sports.sportsnet.repository;

import com.sports.sportsnet.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AchievementRepository extends JpaRepository<Achievement, UUID> {
    List<Achievement> findByUser_UserId(UUID userId);
    Optional<Achievement> findByIdAndUser_UserId(UUID id, UUID userId);
}