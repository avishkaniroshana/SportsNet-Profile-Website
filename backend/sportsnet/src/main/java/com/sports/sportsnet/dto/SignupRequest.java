package com.sports.sportsnet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

    @Schema(description = "Full name of the user", example = "User")
    @NotBlank(message = "Full name is required!")
    private String fullName;

    @Schema(description = "Unique email address", example = "user@gmail.com")
    @NotBlank(message = "Email is required!")
    @Email(message = "Email should be valid!(Check again...)")
    private String email;

    @Schema(description = "Telephone number", example = "0771234567")
    @NotBlank(message = "Telephone is required!")
    private String telephone;

    @Schema(description = "Password of the user", example = "12341234")
    @NotBlank(message = "Password is required!")
    @Size(min = 8, message = "Password must be at least 8 characters!")
    private String password;
}