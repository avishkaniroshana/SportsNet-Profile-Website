package com.sports.sportsnet.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;


//Now represents one row per (user, sport) — i.e. one card per sport
//profile — instead of one row per user, since a user can have several.

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileSummaryResponse {

    private UUID userId;
    private UUID sportProfileId;
    private String fullName;
    private String sport;
    private LocalDate dateOfBirth;
    private Double heightCm;
    private Double weightKg;
    private String country;
    private String profileImageUrl;

    //age is computed from dateOfBirth
    public Integer getAge() {
        if (dateOfBirth == null) {
            return null;
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }
}

