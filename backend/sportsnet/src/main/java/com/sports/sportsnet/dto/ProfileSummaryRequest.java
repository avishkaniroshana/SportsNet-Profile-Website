package com.sports.sportsnet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileSummaryRequest {



    @Schema(description = "Full name of the player", example = "Chamara Perera")
    private String fullName;

    @Schema(description = "Sport the player plays", example = "Rugby")
    private String sport;

    @Schema(description = "Player's age, calculated from date of birth", example = "26")
    private Integer age;

    @Schema(description = "Player's height in centimeters", example = "185.0")
    private Double heightCm;

    @Schema(description = "Player's weight in kilograms", example = "90.0")
    private Double weightKg;

    @Schema(description = "Player's country", example = "Sri Lanka")
    private String country;
}
