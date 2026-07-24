package com.sports.sportsnet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private String fullName;
    private String email;
}