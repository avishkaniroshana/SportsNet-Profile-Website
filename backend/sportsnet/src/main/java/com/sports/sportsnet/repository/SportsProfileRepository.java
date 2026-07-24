package com.sports.sportsnet.repository;

import com.sports.sportsnet.entity.SportsProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SportsProfileRepository extends JpaRepository<SportsProfile, UUID> {
    Optional<SportsProfile> findByUser_UserId(UUID userId);
}