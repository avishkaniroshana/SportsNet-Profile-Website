package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.ClubDetailRequest;
import com.sports.sportsnet.dto.ClubDetailResponse;
import com.sports.sportsnet.entity.ClubDetail;
import com.sports.sportsnet.entity.User;
import com.sports.sportsnet.repository.ClubDetailRepository;
import com.sports.sportsnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubDetailService {

    private final ClubDetailRepository clubDetailRepository;
    private final UserRepository userRepository;

    public ClubDetailResponse add(String currentUserEmail, ClubDetailRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ClubDetail detail = ClubDetail.builder()
                .user(user)
                .clubName(request.getClubName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return toResponse(clubDetailRepository.save(detail));
    }

    public ClubDetailResponse update(String currentUserEmail, UUID id, ClubDetailRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ClubDetail detail = clubDetailRepository.findByIdAndUser_UserId(id, user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        detail.setClubName(request.getClubName());
        detail.setDescription(request.getDescription());
        detail.setStartDate(request.getStartDate());
        detail.setEndDate(request.getEndDate());

        return toResponse(clubDetailRepository.save(detail));
    }

    public void delete(String currentUserEmail, UUID id) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ClubDetail detail = clubDetailRepository.findByIdAndUser_UserId(id, user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        clubDetailRepository.delete(detail);
    }

    public List<ClubDetailResponse> getMine(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return getByUserId(user.getUserId());
    }

    public List<ClubDetailResponse> getByUserId(UUID userId) {
        return clubDetailRepository.findByUser_UserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ClubDetailResponse toResponse(ClubDetail detail) {
        return ClubDetailResponse.builder()
                .id(detail.getId().toString())
                .clubName(detail.getClubName())
                .description(detail.getDescription())
                .startDate(detail.getStartDate())
                .endDate(detail.getEndDate())
                .build();
    }
}