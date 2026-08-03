package com.sports.sportsnet.repository;

import com.sports.sportsnet.entity.PersonalProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonalProfileRepository extends JpaRepository<PersonalProfile, UUID> {
    Optional<PersonalProfile> findByUser_UserId(UUID userId);
}
