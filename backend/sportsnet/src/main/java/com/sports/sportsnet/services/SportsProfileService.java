package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.SportsProfileRequest;
import com.sports.sportsnet.dto.SportsProfileResponse;
import com.sports.sportsnet.entity.SportsProfile;
import com.sports.sportsnet.entity.User;
import com.sports.sportsnet.repository.SportsProfileRepository;
import com.sports.sportsnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SportsProfileService {

    private final SportsProfileRepository sportsProfileRepository;
    private final UserRepository userRepository;

    public SportsProfileResponse add(String currentUserEmail, SportsProfileRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (sportsProfileRepository.existsByUser_UserIdAndSportIgnoreCase(user.getUserId(), request.getSport())) {
            throw new IllegalArgumentException("You already have a profile for this sport!");
        }

        SportsProfile profile = SportsProfile.builder()
                .user(user)
                .sport(request.getSport())
                .position(request.getPosition())
                .bio(request.getBio())
                .build();

        return toResponse(sportsProfileRepository.save(profile));
    }

    public SportsProfileResponse update(String currentUserEmail, UUID id, SportsProfileRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SportsProfile profile = sportsProfileRepository.findByIdAndUser_UserId(id, user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        profile.setSport(request.getSport());
        profile.setPosition(request.getPosition());
        profile.setBio(request.getBio());

        return toResponse(sportsProfileRepository.save(profile));
    }

    public void delete(String currentUserEmail, UUID id) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SportsProfile profile = sportsProfileRepository.findByIdAndUser_UserId(id, user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        //  achievements/clubs/teams under this sport profile will be deleted too

        sportsProfileRepository.delete(profile);
    }

    public List<SportsProfileResponse> getMine(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return getByUserId(user.getUserId());
    }

    public List<SportsProfileResponse> getByUserId(UUID userId) {
        return sportsProfileRepository.findByUser_UserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private SportsProfileResponse toResponse(SportsProfile profile) {
        return SportsProfileResponse.builder()
                .id(profile.getId().toString())
                .userId(profile.getUser().getUserId().toString())
                .sport(profile.getSport())
                .position(profile.getPosition())
                .bio(profile.getBio())
                .build();
    }
}




