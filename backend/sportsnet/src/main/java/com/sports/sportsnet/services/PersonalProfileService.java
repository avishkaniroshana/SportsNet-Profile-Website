package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.PersonalProfileRequest;
import com.sports.sportsnet.dto.PersonalProfileResponse;
import com.sports.sportsnet.entity.PersonalProfile;
import com.sports.sportsnet.entity.User;
import com.sports.sportsnet.repository.PersonalProfileRepository;
import com.sports.sportsnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PersonalProfileService {

    private final PersonalProfileRepository personalProfileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public PersonalProfileResponse createOrUpdateProfile(String currentUserEmail, PersonalProfileRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        PersonalProfile profile = personalProfileRepository.findByUser_UserId(user.getUserId())
                .orElse(PersonalProfile.builder().user(user).build());

        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setHeightCm(request.getHeightCm());
        profile.setWeightKg(request.getWeightKg());
        profile.setCountry(request.getCountry());
        profile.setLocation(request.getLocation());
        profile.setContactVisible(request.isContactVisible());

        return toResponse(personalProfileRepository.save(profile));
    }

    public PersonalProfileResponse getProfileByUserId(UUID userId) {
        PersonalProfile profile = personalProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
        return toResponse(profile);
    }

    public PersonalProfileResponse uploadProfileImage(String currentUserEmail, MultipartFile file) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        PersonalProfile profile = personalProfileRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Create your profile before uploading an image"));

        if (profile.getProfileImagePath() != null) {
            fileStorageService.deleteFile(profile.getProfileImagePath());
        }

        String storedFilename = fileStorageService.storeFile(file);
        profile.setProfileImagePath(storedFilename);

        return toResponse(personalProfileRepository.save(profile));
    }

    private PersonalProfileResponse toResponse(PersonalProfile profile) {
        User user = profile.getUser();

        Integer age = profile.getDateOfBirth() != null
                ? Period.between(profile.getDateOfBirth(), LocalDate.now()).getYears()
                : null;

        String imageUrl = profile.getProfileImagePath() != null
                ? "/images/" + profile.getProfileImagePath()
                : null;

        return PersonalProfileResponse.builder()
                .userId(user.getUserId().toString())
                .fullName(user.getFullName())
                .age(age)
                .heightCm(profile.getHeightCm())
                .weightKg(profile.getWeightKg())
                .country(profile.getCountry())
                .location(profile.getLocation())
                .profileImageUrl(imageUrl)
                .telephone(profile.isContactVisible() ? user.getTelephone() : null)
                .email(profile.isContactVisible() ? user.getEmail() : null)
                .build();
    }
}

