package com.sports.sportsnet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SportsProfileRequest {

    @Schema(description = "Sport the player plays", example = "Cricket")
    @NotBlank(message = "Sport is required!")
    private String sport;

    @Schema(description = "Player's position in the sport", example = "Batsman")
    private String position;

    @Schema(description = "Short bio about the player for this sport", example = "Aspiring cricketer from Kandy")
    private String bio;
}
