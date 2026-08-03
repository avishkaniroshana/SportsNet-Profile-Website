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
        // if set the FK to ON DELETE CASCADE — see migration/README for details.
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



//1111111111111111111111111111111111111111111111111111111111111111111


//package com.sports.sportsnet.services;
//
//import com.sports.sportsnet.dto.SportsProfileRequest;
//import com.sports.sportsnet.dto.SportsProfileResponse;
//import com.sports.sportsnet.entity.SportsProfile;
//import com.sports.sportsnet.entity.User;
//import com.sports.sportsnet.repository.SportsProfileRepository;
//import com.sports.sportsnet.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.time.LocalDate;
//import java.time.Period;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class SportsProfileService {
//
//    private final SportsProfileRepository sportsProfileRepository;
//    private final UserRepository userRepository;
//    private final FileStorageService fileStorageService;
//
//    public SportsProfileResponse createOrUpdateProfile(String currentUserEmail, SportsProfileRequest request) {
//        User user = userRepository.findByEmail(currentUserEmail)
//                .orElseThrow(() -> new IllegalArgumentException("User not found"));
//
//        SportsProfile profile = sportsProfileRepository.findByUser_UserId(user.getUserId())
//                .orElse(SportsProfile.builder().user(user).build());
//
//        profile.setSport(request.getSport());
//        profile.setPosition(request.getPosition());
//        profile.setBio(request.getBio());
//        profile.setDateOfBirth(request.getDateOfBirth());
//        profile.setHeightCm(request.getHeightCm());
//        profile.setWeightKg(request.getWeightKg());
//        profile.setCountry(request.getCountry());
//        profile.setLocation(request.getLocation());
//        profile.setContactVisible(request.isContactVisible());
//
//        return toResponse(sportsProfileRepository.save(profile));
//    }
//
//    public SportsProfileResponse getProfileByUserId(UUID userId) {
//        SportsProfile profile = sportsProfileRepository.findByUser_UserId(userId)
//                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
//        return toResponse(profile);
//    }
//
//    public SportsProfileResponse uploadProfileImage(String currentUserEmail, MultipartFile file) {
//        User user = userRepository.findByEmail(currentUserEmail)
//                .orElseThrow(() -> new IllegalArgumentException("User not found"));
//
//        SportsProfile profile = sportsProfileRepository.findByUser_UserId(user.getUserId())
//                .orElseThrow(() -> new IllegalArgumentException("Create your profile before uploading an image"));
//
//        // delete the old image file from disk if one exists, so orphaned files don't pile up
//        if (profile.getProfileImagePath() != null) {
//            fileStorageService.deleteFile(profile.getProfileImagePath());
//        }
//
//        String storedFilename = fileStorageService.storeFile(file);
//        profile.setProfileImagePath(storedFilename);
//
//        return toResponse(sportsProfileRepository.save(profile));
//    }
//
//    private SportsProfileResponse toResponse(SportsProfile profile) {
//        User user = profile.getUser();
//
//        Integer age = profile.getDateOfBirth() != null
//                ? Period.between(profile.getDateOfBirth(), LocalDate.now()).getYears()
//                : null;
//
//        String imageUrl = profile.getProfileImagePath() != null
//                ? "/images/" + profile.getProfileImagePath()
//                : null;
//
//        return SportsProfileResponse.builder()
//                .userId(user.getUserId().toString())
//                .fullName(user.getFullName())
//                .sport(profile.getSport())
//                .position(profile.getPosition())
//                .bio(profile.getBio())
//                .age(age)
//                .heightCm(profile.getHeightCm())
//                .weightKg(profile.getWeightKg())
//                .country(profile.getCountry())
//                .location(profile.getLocation())
//                .profileImageUrl(imageUrl)
//                .telephone(profile.isContactVisible() ? user.getTelephone() : null)
//                .email(profile.isContactVisible() ? user.getEmail() : null)
//                .build();
//    }
//}
