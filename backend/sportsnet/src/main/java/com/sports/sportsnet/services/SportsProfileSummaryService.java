package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.ProfileSummaryResponse;
import com.sports.sportsnet.entity.SportsProfile;
import com.sports.sportsnet.entity.User;
import com.sports.sportsnet.repository.SportsProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

@Service
@RequiredArgsConstructor
public class SportsProfileSummaryService {

    private final SportsProfileRepository sportsProfileRepository;

    private ProfileSummaryResponse getAllSummaryResponse(SportsProfile profile) {
        User user = profile.getUser();

        Integer age = profile.getDateOfBirth() != null
                ? Period.between(profile.getDateOfBirth(), LocalDate.now()).getYears()
                :null;

        return ProfileSummaryResponse.builder()
                .userId(user.getUserId().toString())
                .fullName(user.getFullName())
                .sport(profile.getSport())
                .age(age)
                .heightCm(profile.getHeightCm())
                .weightKg(profile.getWeightKg())
                .country(profile.getCountry())
                .build();
    }

    public Page<ProfileSummaryResponse> getAllProfiles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return sportsProfileRepository.findAll(pageable).map(profile -> getAllSummaryResponse(profile));
    }


}
