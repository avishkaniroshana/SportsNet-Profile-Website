package com.sports.sportsnet.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileSummaryResponse {


    private String userId;
    private String fullName;
    private String sport;
    private Integer age;
    private Double heightCm;
    private Double weightKg;
    private String country;
}
