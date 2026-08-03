package com.sports.sportsnet.repository;

import com.sports.sportsnet.dto.ProfileSummaryResponse;
import com.sports.sportsnet.entity.SportsProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SportsProfileRepository extends JpaRepository<SportsProfile, UUID> {

    // replaces the old findByUser_UserId() that returned Optional — a user can now have several
    List<SportsProfile> findByUser_UserId(UUID userId);

    Optional<SportsProfile> findByIdAndUser_UserId(UUID id, UUID userId);

    boolean existsByUser_UserIdAndSportIgnoreCase(UUID userId, String sport);

    // moved here from the old SportsProfileRepository, now joins PersonalProfile too
    @Query("SELECT new com.sports.sportsnet.dto.ProfileSummaryResponse(" +
            "u.userId, sp.id, u.fullName, sp.sport, pp.dateOfBirth, pp.heightCm, pp.weightKg, pp.country, " +
            "CASE WHEN pp.profileImagePath IS NOT NULL THEN CONCAT('/images/', pp.profileImagePath) ELSE NULL END) " +
            "FROM SportsProfile sp JOIN sp.user u JOIN PersonalProfile pp ON pp.user = u")
    Page<ProfileSummaryResponse> findAllSummaries(Pageable pageable);
}





//public interface SportsProfileRepository extends JpaRepository<SportsProfile, UUID> {
//    Optional<SportsProfile> findByUser_UserId(UUID userId);
//
//    @Query("SELECT new com.sports.sportsnet.dto.ProfileSummaryResponse(" +
//            "u.fullName, p.sport, p.dateOfBirth, p.heightCm, p.weightKg, p.country, " +
//            "CASE WHEN p.profileImagePath IS NOT NULL THEN CONCAT('/images/', p.profileImagePath) ELSE NULL END) " +
//            "FROM SportsProfile p JOIN p.user u")
//    Page<ProfileSummaryResponse> findAllSummaries(Pageable pageable);
//}


//previous query


//
//@Repository
//public interface SportsProfileRepository extends JpaRepository<SportsProfile, UUID> {
//    Optional<SportsProfile> findByUser_UserId(UUID userId);
//
//    @Query("SELECT new com.sports.sportsnet.dto.ProfileSummaryResponse(" +
//            "u.fullName, p.sport, p.dateOfBirth, p.heightCm, p.weightKg, p.country, p.profileImagePath) " +
//            "FROM SportsProfile p JOIN p.user u")
//    Page<ProfileSummaryResponse> findAllSummaries(Pageable pageable);
//}