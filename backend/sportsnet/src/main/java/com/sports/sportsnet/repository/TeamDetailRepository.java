package com.sports.sportsnet.repository;

import com.sports.sportsnet.entity.TeamDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamDetailRepository extends JpaRepository<TeamDetail, UUID> {
    List<TeamDetail> findBySportProfile_Id(UUID sportProfileId);
    Optional<TeamDetail> findByIdAndSportProfile_Id(UUID id, UUID sportProfileId);
}


//111111111111111111111111111111111111111111111111111111111111111

//
//public interface TeamDetailRepository extends JpaRepository<TeamDetail, UUID> {
//    List<TeamDetail> findByUser_UserId(UUID userId);
//    Optional<TeamDetail> findByIdAndUser_UserId(UUID id, UUID userId);
//}