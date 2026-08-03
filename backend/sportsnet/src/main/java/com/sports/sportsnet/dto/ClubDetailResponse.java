package com.sports.sportsnet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class ClubDetailResponse {
    private String id;
    private String sportProfileId; // new
    private String clubName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
}

