package com.sports.sportsnet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ClubDetailRequest {
    @Schema(description = "Full name of the user", example = "SSC")
    @NotBlank(message = "Club name is required!")
    private String clubName;

    @Schema(description = "Description of the user", example = "SSC")
    private String description;

    @Schema(description = "On this day joined the club", example = "2023-01-01")
    private LocalDate startDate;

    @Schema(description = "On this day left the club", example = "2023-01-01 or null")
    private LocalDate endDate;
}