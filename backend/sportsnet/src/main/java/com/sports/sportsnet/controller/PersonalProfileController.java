package com.sports.sportsnet.controller;

import com.sports.sportsnet.dto.PersonalProfileRequest;
import com.sports.sportsnet.dto.PersonalProfileResponse;
import com.sports.sportsnet.security.SecurityUtils;
import com.sports.sportsnet.services.PersonalProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Personal Profile", description = "Create, update, and view a player's sport-agnostic personal details (one per user)")
public class PersonalProfileController {

    private final PersonalProfileService personalProfileService;

    @Operation(summary = "Create or update the logged-in player's own personal profile")
    @ApiResponse(responseCode = "200", description = "Profile saved successfully")
    @PutMapping("/me")
    public ResponseEntity<PersonalProfileResponse> updateMyProfile(@Valid @RequestBody PersonalProfileRequest request) {
        String email = SecurityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(personalProfileService.createOrUpdateProfile(email, request));
    }

    @Operation(summary = "Upload or replace the logged-in player's profile image")
    @ApiResponse(responseCode = "200", description = "Image uploaded successfully")
    @ApiResponse(responseCode = "400", description = "Invalid file type or profile doesn't exist yet")
    @PostMapping(value = "/me/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PersonalProfileResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        String email = SecurityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(personalProfileService.uploadProfileImage(email, file));
    }

    @Operation(summary = "Get a single player's personal profile by user ID")
    @ApiResponse(responseCode = "200", description = "Profile found")
    @GetMapping("/{userId}")
    public ResponseEntity<PersonalProfileResponse> getProfile(
            @Parameter(description = "UUID of the user whose profile to fetch") @PathVariable UUID userId) {
        return ResponseEntity.ok(personalProfileService.getProfileByUserId(userId));
    }
}
