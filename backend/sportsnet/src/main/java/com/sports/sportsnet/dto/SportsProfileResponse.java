package com.sports.sportsnet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SportsProfileResponse {
    private String id;
    private String userId;
    private String sport;
    private String position;
    private String bio;
}

