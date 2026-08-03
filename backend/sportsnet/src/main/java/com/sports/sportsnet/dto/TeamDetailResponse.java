package com.sports.sportsnet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class TeamDetailResponse {
    private String id;
    private String sportProfileId;
    private String teamName;
    private String details;
    private LocalDate startDate;
    private LocalDate endDate;
}


