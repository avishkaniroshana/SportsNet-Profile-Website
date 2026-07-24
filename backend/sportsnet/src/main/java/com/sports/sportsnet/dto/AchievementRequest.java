package com.sports.sportsnet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AchievementRequest {
    @Schema(description = "Title of the achievement", example = "Best Player")
    @NotBlank(message = "Title is required!")
    private String title;

    @Schema(description = "Description of the achievement", example = "Best player of the season")
    private String description;
}