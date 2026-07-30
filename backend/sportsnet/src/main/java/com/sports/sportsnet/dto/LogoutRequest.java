package com.sports.sportsnet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogoutRequest {

    @Schema(description = "The refresh token to invalidate")
    @NotBlank(message = "Refresh token is required!")
    private String refreshToken;
}