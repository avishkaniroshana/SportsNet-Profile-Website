package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.ClubDetailRequest;
import com.sports.sportsnet.dto.ClubDetailResponse;
import com.sports.sportsnet.entity.ClubDetail;
import com.sports.sportsnet.entity.SportsProfile;
import com.sports.sportsnet.repository.ClubDetailRepository;
import com.sports.sportsnet.repository.SportsProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubDetailService {

    private final ClubDetailRepository clubDetailRepository;
    private final SportsProfileRepository sportsProfileRepository;

    public ClubDetailResponse add(String currentUserEmail, UUID sportsProfileId, ClubDetailRequest request) {
        SportsProfile sportsProfile = getOwnedSportProfile(currentUserEmail, sportsProfileId);

        ClubDetail detail = ClubDetail.builder()
                .sportProfile(sportsProfile)
                .clubName(request.getClubName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return toResponse(clubDetailRepository.save(detail));
    }

    public ClubDetailResponse update(String currentUserEmail, UUID sportProfileId, UUID id, ClubDetailRequest request) {
        getOwnedSportProfile(currentUserEmail, sportProfileId);

        ClubDetail detail = clubDetailRepository.findByIdAndSportProfile_Id(id, sportProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        detail.setClubName(request.getClubName());
        detail.setDescription(request.getDescription());
        detail.setStartDate(request.getStartDate());
        detail.setEndDate(request.getEndDate());

        return toResponse(clubDetailRepository.save(detail));
    }

    public void delete(String currentUserEmail, UUID sportProfileId, UUID id) {
        getOwnedSportProfile(currentUserEmail, sportProfileId);

        ClubDetail detail = clubDetailRepository.findByIdAndSportProfile_Id(id, sportProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        clubDetailRepository.delete(detail);
    }

    public List<ClubDetailResponse> getBySportProfileId(UUID sportProfileId) {
        return clubDetailRepository.findBySportProfile_Id(sportProfileId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private SportsProfile getOwnedSportProfile(String currentUserEmail, UUID sportProfileId) {
        return sportsProfileRepository.findById(sportProfileId)
                .filter(sp -> sp.getUser().getEmail().equalsIgnoreCase(currentUserEmail))
                .orElseThrow(() -> new IllegalArgumentException("Sport profile not found or does not belong to this user"));
    }

    private ClubDetailResponse toResponse(ClubDetail detail) {
        return ClubDetailResponse.builder()
                .id(detail.getId().toString())
                .sportProfileId(detail.getSportProfile().getId().toString())
                .clubName(detail.getClubName())
                .description(detail.getDescription())
                .startDate(detail.getStartDate())
                .endDate(detail.getEndDate())
                .build();
    }
}

