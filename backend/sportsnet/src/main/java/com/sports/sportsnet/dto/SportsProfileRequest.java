package com.sports.sportsnet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SportsProfileRequest {

    @Schema(description = "Sport the player plays", example = "Cricket")
    @NotBlank(message = "Sport is required!")
    private String sport;

    @Schema(description = "Player's position in the sport", example = "Batsman")
    private String position;

    @Schema(description = "Short bio about the player", example = "Aspiring cricketer from Kandy")
    private String bio;

    @Schema(description = "Player's date of birth, used to calculate age", example = "2001-05-14")
    private LocalDate dateOfBirth;

    @Schema(description = "Player's height in centimeters", example = "175.0")
    private Double heightCm;

    @Schema(description = "Player's weight in kilograms", example = "68.0")
    private Double weightKg;

    @Schema(description = "Player's country", example = "Sri Lanka")
    private String country;

    @Schema(description = "Player's location or city", example = "Kandy")
    private String location;

    @Schema(description = "Whether telephone/email should be visible on the public profile", example = "true")
    private boolean contactVisible; // defaults to false if omitted
}


//package com.sports.sportsnet.dto;
//
//import jakarta.validation.constraints.NotBlank;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.time.LocalDate;
//
//@Getter
//@Setter
//public class SportsProfileRequest {
//
//    @NotBlank(message = "Sport is required!")
//    private String sport;
//
//    private String position;
//    private String bio;
//    private LocalDate dateOfBirth;
//    private Double heightCm;
//    private Double weightKg;
//    private String country;
//    private String location;
//    private boolean contactVisible; //defaults to false if omitted
//}