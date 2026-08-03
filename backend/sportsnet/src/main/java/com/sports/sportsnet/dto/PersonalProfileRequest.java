package com.sports.sportsnet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PersonalProfileRequest {

    @Schema(description = "Date of birth, used to calculate age", example = "2001-05-14")
    private LocalDate dateOfBirth;

    @Schema(description = "Height in centimeters", example = "175.0")
    private Double heightCm;

    @Schema(description = "Weight in kilograms", example = "68.0")
    private Double weightKg;

    @Schema(description = "Country", example = "Sri Lanka")
    private String country;

    @Schema(description = "Location or city", example = "Kandy")
    private String location;

    @Schema(description = "Whether telephone/email should be visible on the public profile", example = "true")
    private boolean contactVisible;
}
