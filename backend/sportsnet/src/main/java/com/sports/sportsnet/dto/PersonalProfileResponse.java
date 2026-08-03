package com.sports.sportsnet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PersonalProfileResponse {
    private String userId;
    private String fullName;
    private Integer age;
    private Double heightCm;
    private Double weightKg;
    private String country;
    private String location;
    private String profileImageUrl;
    private String telephone;
    private String email;
}
