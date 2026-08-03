package com.sports.sportsnet.controller;

import com.sports.sportsnet.dto.SportsProfileRequest;
import com.sports.sportsnet.dto.SportsProfileResponse;
import com.sports.sportsnet.security.SecurityUtils;
import com.sports.sportsnet.services.SportsProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sport-profiles")
@RequiredArgsConstructor
@Tag(name = "Sport Profiles", description = "Create, update, and view a player's per-sport profiles — a player can have more than one")
public class SportsProfileController {

    private final SportsProfileService sportProfileService;

    @Operation(summary = "Add a new sport profile for the logged-in player (e.g. a second sport)")
    @ApiResponse(responseCode = "200", description = "Sport profile created")
    @ApiResponse(responseCode = "400", description = "Validation failed, or a profile for this sport already exists")
    @PostMapping
    public ResponseEntity<SportsProfileResponse> add(@Valid @RequestBody SportsProfileRequest request) {
        return ResponseEntity.ok(sportProfileService.add(SecurityUtils.getCurrentUserEmail(), request));
    }

    @Operation(summary = "Update one of the logged-in player's sport profiles")
    @ApiResponse(responseCode = "200", description = "Sport profile updated")
    @ApiResponse(responseCode = "400", description = "Record not found or does not belong to this user")
    @PutMapping("/{id}")
    public ResponseEntity<SportsProfileResponse> update(
            @Parameter(description = "ID of the sport profile to update") @PathVariable UUID id,
            @Valid @RequestBody SportsProfileRequest request) {
        return ResponseEntity.ok(sportProfileService.update(SecurityUtils.getCurrentUserEmail(), id, request));
    }

    @Operation(summary = "Delete one of the logged-in player's sport profiles")
    @ApiResponse(responseCode = "204", description = "Sport profile deleted")
    @ApiResponse(responseCode = "400", description = "Record not found or does not belong to this user")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID of the sport profile to delete") @PathVariable UUID id) {
        sportProfileService.delete(SecurityUtils.getCurrentUserEmail(), id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "List all sport profiles for the logged-in player")
    @ApiResponse(responseCode = "200", description = "List of the current user's sport profiles")
    @GetMapping("/me")
    public ResponseEntity<List<SportsProfileResponse>> getMine() {
        return ResponseEntity.ok(sportProfileService.getMine(SecurityUtils.getCurrentUserEmail()));
    }

    @Operation(summary = "List all sport profiles for a given user by ID")
    @ApiResponse(responseCode = "200", description = "List of that user's sport profiles")
    @GetMapping("/{userId}")
    public ResponseEntity<List<SportsProfileResponse>> getByUser(
            @Parameter(description = "UUID of the user whose sport profiles to fetch") @PathVariable UUID userId) {
        return ResponseEntity.ok(sportProfileService.getByUserId(userId));
    }
}


