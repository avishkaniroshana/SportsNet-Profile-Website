package com.sports.sportsnet.services;


import com.sports.sportsnet.dto.ProfileSummaryResponse;
import com.sports.sportsnet.dto.SportsProfileRequest;
import com.sports.sportsnet.dto.SportsProfileResponse;
import com.sports.sportsnet.entity.SportsProfile;
import com.sports.sportsnet.entity.User;
import com.sports.sportsnet.repository.SportsProfileRepository;
import com.sports.sportsnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SportsProfileService {

    private final SportsProfileRepository sportsProfileRepository;
    private final UserRepository userRepository;

    public SportsProfileResponse createOrUpdateProfile(String currentUserEmail, SportsProfileRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SportsProfile profile = sportsProfileRepository.findByUser_UserId(user.getUserId())
                .orElse(SportsProfile.builder().user(user).build());

        profile.setSport(request.getSport());
        profile.setPosition(request.getPosition());
        profile.setBio(request.getBio());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setHeightCm(request.getHeightCm());
        profile.setWeightKg(request.getWeightKg());
        profile.setCountry(request.getCountry());
        profile.setLocation(request.getLocation());
        profile.setContactVisible(request.isContactVisible());

        return toResponse(sportsProfileRepository.save(profile));
    }

    public SportsProfileResponse getProfileByUserId(UUID userId) {
        SportsProfile profile = sportsProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
        return toResponse(profile);
    }

    private SportsProfileResponse toResponse(SportsProfile profile) {
        User user = profile.getUser();

        Integer age = profile.getDateOfBirth() != null
                ? Period.between(profile.getDateOfBirth(), LocalDate.now()).getYears()
                : null;

        return SportsProfileResponse.builder()
                .userId(user.getUserId().toString())
                .fullName(user.getFullName())
                .sport(profile.getSport())
                .position(profile.getPosition())
                .bio(profile.getBio())
                .age(age)
                .heightCm(profile.getHeightCm())
                .weightKg(profile.getWeightKg())
                .country(profile.getCountry())
                .location(profile.getLocation())
                .telephone(profile.isContactVisible() ? user.getTelephone() : null)
                .email(profile.isContactVisible() ? user.getEmail() : null)
                .build();
    }



    //task 1
//    public List<SportsProfileResponse> getAllProfiles() {
//        return sportsProfileRepository.findAll()
//                .stream()
//                .map(profile -> toResponse(profile))
//                .collect(Collectors.toList());
//    }









}
