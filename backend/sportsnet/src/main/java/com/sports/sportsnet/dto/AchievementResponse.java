package com.sports.sportsnet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AchievementResponse {
    private String id;
    private String sportProfileId;
    private String title;
    private String description;
}



