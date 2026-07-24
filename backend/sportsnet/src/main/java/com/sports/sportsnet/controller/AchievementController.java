package com.sports.sportsnet.controller;

import com.sports.sportsnet.dto.AchievementRequest;
import com.sports.sportsnet.dto.AchievementResponse;
import com.sports.sportsnet.security.SecurityUtils;
import com.sports.sportsnet.services.AchievementService;
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
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
@Tag(name = "Achievements", description = "Manage a player's list of achievements")
public class AchievementController {

    private final AchievementService achievementService;

    @Operation(summary = "Add a new achievement entry to logged-in player")
    @ApiResponse(responseCode = "200", description = "Entry created")
    @ApiResponse(responseCode = "400", description = "Validation failed!")
    @PostMapping
    public ResponseEntity<AchievementResponse> add(@Valid @RequestBody AchievementRequest request) {
        return ResponseEntity.ok(achievementService.add(SecurityUtils.getCurrentUserEmail(), request));
    }

    @Operation(summary = "Update one of the logged-in player's achievement entries")
    @ApiResponse(responseCode = "200", description = "Entry updated")
    @ApiResponse(responseCode = "400", description = "Record not found or does not belong to this user")
    @PutMapping("/{id}")
    public ResponseEntity<AchievementResponse> update(
            @Parameter(description = "ID of the achievement entry to update") @PathVariable UUID id,
            @Valid @RequestBody AchievementRequest request) {
        return ResponseEntity.ok(achievementService.update(SecurityUtils.getCurrentUserEmail(), id, request));
    }

    @Operation(summary = "Delete one of the logged-in player's achievement entries")
    @ApiResponse(responseCode = "204", description = "Entry deleted")
    @ApiResponse(responseCode = "400", description = "Record not found or does not belong to this user")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID of the achievement entry to delete") @PathVariable UUID id) {
        achievementService.delete(SecurityUtils.getCurrentUserEmail(), id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "List all achievement entries for the logged-in player")
    @ApiResponse(responseCode = "200", description = "List of the current user's entries")
    @GetMapping("/me")
    public ResponseEntity<List<AchievementResponse>> getMine() {
        return ResponseEntity.ok(achievementService.getMine(SecurityUtils.getCurrentUserEmail()));
    }

    @Operation(summary = "List all achievement entries for a given user by ID")
    @ApiResponse(responseCode = "200", description = "List of that user's entries")
    @GetMapping("/{userId}")
    public ResponseEntity<List<AchievementResponse>> getByUser(
            @Parameter(description = "UUID of the user whose entries to fetch") @PathVariable UUID userId) {
        return ResponseEntity.ok(achievementService.getByUserId(userId));
    }
}