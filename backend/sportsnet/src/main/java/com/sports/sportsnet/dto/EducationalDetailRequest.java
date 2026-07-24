package com.sports.sportsnet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EducationalDetailRequest {
    @Schema(description = "Institution name", example = "University of Colombo")
    @NotBlank(message = "Institution name is required!")
    private String institutionName;

    @Schema(description = "Degree", example = "Bachelor of Science")
    private String description;

    @Schema(description = "Start date", example = "2020-01-01")
    private LocalDate startDate;

    @Schema(description = "End date", example = "2020-01-01 or null")
    private LocalDate endDate;
}