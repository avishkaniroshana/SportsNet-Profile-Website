package com.sports.sportsnet.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileSummaryResponse {

    private String fullName;
    private String sport;
    private LocalDate dateOfBirth;
    private Double heightCm;
    private Double weightKg;
    private String country;
    private String profileImageUrl;

    // Calculated field - age is computed from dateOfBirth
    public Integer getAge() {
        if (dateOfBirth == null) {
            return null;
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }
}

