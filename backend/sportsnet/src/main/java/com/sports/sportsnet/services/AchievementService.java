package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.AchievementRequest;
import com.sports.sportsnet.dto.AchievementResponse;
import com.sports.sportsnet.entity.Achievement;
import com.sports.sportsnet.entity.User;
import com.sports.sportsnet.repository.AchievementRepository;
import com.sports.sportsnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserRepository userRepository;

    public AchievementResponse add(String currentUserEmail, AchievementRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Achievement achievement = Achievement.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .build();

        return toResponse(achievementRepository.save(achievement));
    }

    public AchievementResponse update(String currentUserEmail, UUID id, AchievementRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Achievement achievement = achievementRepository.findByIdAndUser_UserId(id, user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        achievement.setTitle(request.getTitle());
        achievement.setDescription(request.getDescription());

        return toResponse(achievementRepository.save(achievement));
    }

    public void delete(String currentUserEmail, UUID id) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Achievement achievement = achievementRepository.findByIdAndUser_UserId(id, user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        achievementRepository.delete(achievement);
    }

    public List<AchievementResponse> getMine(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return getByUserId(user.getUserId());
    }

    public List<AchievementResponse> getByUserId(UUID userId) {
        return achievementRepository.findByUser_UserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private AchievementResponse toResponse(Achievement achievement) {
        return AchievementResponse.builder()
                .id(achievement.getId().toString())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .build();
    }
}