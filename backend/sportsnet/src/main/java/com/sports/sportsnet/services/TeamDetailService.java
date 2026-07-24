package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.TeamDetailRequest;
import com.sports.sportsnet.dto.TeamDetailResponse;
import com.sports.sportsnet.entity.TeamDetail;
import com.sports.sportsnet.entity.User;
import com.sports.sportsnet.repository.TeamDetailRepository;
import com.sports.sportsnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamDetailService {

    private final TeamDetailRepository teamDetailRepository;
    private final UserRepository userRepository;

    public TeamDetailResponse add(String currentUserEmail, TeamDetailRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TeamDetail detail = TeamDetail.builder()
                .user(user)
                .teamName(request.getTeamName())
                .details(request.getDetails())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return toResponse(teamDetailRepository.save(detail));
    }

    public TeamDetailResponse update(String currentUserEmail, UUID id, TeamDetailRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TeamDetail detail = teamDetailRepository.findByIdAndUser_UserId(id, user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        detail.setTeamName(request.getTeamName());
        detail.setDetails(request.getDetails());
        detail.setStartDate(request.getStartDate());
        detail.setEndDate(request.getEndDate());

        return toResponse(teamDetailRepository.save(detail));
    }

    public void delete(String currentUserEmail, UUID id) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TeamDetail detail = teamDetailRepository.findByIdAndUser_UserId(id, user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        teamDetailRepository.delete(detail);
    }

    public List<TeamDetailResponse> getMine(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return getByUserId(user.getUserId());
    }

    public List<TeamDetailResponse> getByUserId(UUID userId) {
        return teamDetailRepository.findByUser_UserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private TeamDetailResponse toResponse(TeamDetail detail) {
        return TeamDetailResponse.builder()
                .id(detail.getId().toString())
                .teamName(detail.getTeamName())
                .details(detail.getDetails())
                .startDate(detail.getStartDate())
                .endDate(detail.getEndDate())
                .build();
    }
}