package com.sports.sportsnet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TeamDetailRequest {
    @Schema(description = "Name of the team", example = "Ruhuna University Cricket Team")
    @NotBlank(message = "Team name is required!")
    private String teamName;

    @Schema(description = "Details about the player's role or involvement in the team", example = "Playing as vice-captain")
    private String details;

    @Schema(description = "Date the player joined the team", example = "2022-01-15")
    private LocalDate startDate;

    @Schema(description = "Date the player left the team, or null if still active", example = "null")
    private LocalDate endDate;
}