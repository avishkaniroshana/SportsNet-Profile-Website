package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.AchievementRequest;
import com.sports.sportsnet.dto.AchievementResponse;
import com.sports.sportsnet.entity.Achievement;
import com.sports.sportsnet.entity.SportsProfile;
import com.sports.sportsnet.repository.AchievementRepository;
import com.sports.sportsnet.repository.SportsProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final SportsProfileRepository sportsProfileRepository;

    public AchievementResponse add(String currentUserEmail, UUID sportsProfileId, AchievementRequest request) {
        SportsProfile sportsProfile = getOwnedSportProfile(currentUserEmail, sportsProfileId);

        Achievement achievement = Achievement.builder()
                .sportProfile(sportsProfile)
                .title(request.getTitle())
                .description(request.getDescription())
                .build();

        return toResponse(achievementRepository.save(achievement));
    }

    public AchievementResponse update(String currentUserEmail, UUID sportProfileId, UUID id, AchievementRequest request) {
        getOwnedSportProfile(currentUserEmail, sportProfileId);

        Achievement achievement = achievementRepository.findByIdAndSportProfile_Id(id, sportProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        achievement.setTitle(request.getTitle());
        achievement.setDescription(request.getDescription());

        return toResponse(achievementRepository.save(achievement));
    }

    public void delete(String currentUserEmail, UUID sportProfileId, UUID id) {
        getOwnedSportProfile(currentUserEmail, sportProfileId);

        Achievement achievement = achievementRepository.findByIdAndSportProfile_Id(id, sportProfileId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        achievementRepository.delete(achievement);
    }

    // public — used to show a sport profile's achievements on its public page
    public List<AchievementResponse> getBySportProfileId(UUID sportProfileId) {
        return achievementRepository.findBySportProfile_Id(sportProfileId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ownership check: the sport profile must exist AND belong to the currently logged-in user
    private SportsProfile getOwnedSportProfile(String currentUserEmail, UUID sportProfileId) {
        return sportsProfileRepository.findById(sportProfileId)
                .filter(sp -> sp.getUser().getEmail().equalsIgnoreCase(currentUserEmail))
                .orElseThrow(() -> new IllegalArgumentException("Sport profile not found or does not belong to this user"));
    }

    private AchievementResponse toResponse(Achievement achievement) {
        return AchievementResponse.builder()
                .id(achievement.getId().toString())
                .sportProfileId(achievement.getSportProfile().getId().toString())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .build();
    }
}



