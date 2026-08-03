package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.TeamDetailRequest;
import com.sports.sportsnet.dto.TeamDetailResponse;
import com.sports.sportsnet.entity.SportsProfile;
import com.sports.sportsnet.entity.TeamDetail;
import com.sports.sportsnet.repository.SportsProfileRepository;
import com.sports.sportsnet.repository.TeamDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamDetailService {

    private final TeamDetailRepository teamDetailRepository;
    private final SportsProfileRepository sportsProfileRepository;

    public TeamDetailResponse add(String currentUserEmail, UUID sportsProfileId, TeamDetailRequest request) {
        SportsProfile sportsProfile = getOwnedSportProfile(currentUserEmail, sportsProfileId);

        TeamDetail detail = TeamDetail.builder()
                .sportProfile(sportsProfile)
                .teamName(request.getTeamName())
                .details(request.getDetails())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return toResponse(teamDetailRepository.save(detail));
    }

    public TeamDetailResponse update(String currentUserEmail, UUID sportProfileId, UUID id, TeamDetailRequest request) {
        getOwnedSportProfile(currentUserEmail, sportProfileId);

        TeamDetail detail = teamDetailRepository.findByIdAndSportProfile_Id(id, sportProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        detail.setTeamName(request.getTeamName());
        detail.setDetails(request.getDetails());
        detail.setStartDate(request.getStartDate());
        detail.setEndDate(request.getEndDate());

        return toResponse(teamDetailRepository.save(detail));
    }

    public void delete(String currentUserEmail, UUID sportProfileId, UUID id) {
        getOwnedSportProfile(currentUserEmail, sportProfileId);

        TeamDetail detail = teamDetailRepository.findByIdAndSportProfile_Id(id, sportProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        teamDetailRepository.delete(detail);
    }

    public List<TeamDetailResponse> getBySportProfileId(UUID sportProfileId) {
        return teamDetailRepository.findBySportProfile_Id(sportProfileId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private SportsProfile getOwnedSportProfile(String currentUserEmail, UUID sportProfileId) {
        return sportsProfileRepository.findById(sportProfileId)
                .filter(sp -> sp.getUser().getEmail().equalsIgnoreCase(currentUserEmail))
                .orElseThrow(() -> new IllegalArgumentException("Sport profile not found or does not belong to this user"));
    }

    private TeamDetailResponse toResponse(TeamDetail detail) {
        return TeamDetailResponse.builder()
                .id(detail.getId().toString())
                .sportProfileId(detail.getSportProfile().getId().toString())
                .teamName(detail.getTeamName())
                .details(detail.getDetails())
                .startDate(detail.getStartDate())
                .endDate(detail.getEndDate())
                .build();
    }
}
