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
@RequestMapping("/api/sport-profiles/{sportProfileId}/achievements")
@RequiredArgsConstructor
@Tag(name = "Achievements", description = "Manage a player's list of achievements for a specific sport profile")
public class AchievementController {

    private final AchievementService achievementService;

    @Operation(summary = "Add a new achievement entry to one of the logged-in player's sport profiles")
    @ApiResponse(responseCode = "200", description = "Entry created")
    @ApiResponse(responseCode = "400", description = "Validation failed!")
    @PostMapping
    public ResponseEntity<AchievementResponse> add(
            @PathVariable UUID sportProfileId,
            @Valid @RequestBody AchievementRequest request) {
        return ResponseEntity.ok(achievementService.add(SecurityUtils.getCurrentUserEmail(), sportProfileId, request));
    }

    @Operation(summary = "Update an achievement entry under a sport profile")
    @ApiResponse(responseCode = "200", description = "Entry updated")
    @ApiResponse(responseCode = "400", description = "Record not found or does not belong to this user")
    @PutMapping("/{id}")
    public ResponseEntity<AchievementResponse> update(
            @PathVariable UUID sportProfileId,
            @Parameter(description = "ID of the achievement entry to update") @PathVariable UUID id,
            @Valid @RequestBody AchievementRequest request) {
        return ResponseEntity.ok(achievementService.update(SecurityUtils.getCurrentUserEmail(), sportProfileId, id, request));
    }

    @Operation(summary = "Delete an achievement entry under a sport profile")
    @ApiResponse(responseCode = "204", description = "Entry deleted")
    @ApiResponse(responseCode = "400", description = "Record not found or does not belong to this user")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID sportProfileId,
            @Parameter(description = "ID of the achievement entry to delete") @PathVariable UUID id) {
        achievementService.delete(SecurityUtils.getCurrentUserEmail(), sportProfileId, id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "List all achievement entries under a sport profile (public)")
    @ApiResponse(responseCode = "200", description = "List of entries for that sport profile")
    @GetMapping
    public ResponseEntity<List<AchievementResponse>> getBySportProfile(@PathVariable UUID sportProfileId) {
        return ResponseEntity.ok(achievementService.getBySportProfileId(sportProfileId));
    }
}