package com.sports.sportsnet.controller;

import com.sports.sportsnet.dto.TeamDetailRequest;
import com.sports.sportsnet.dto.TeamDetailResponse;
import com.sports.sportsnet.security.SecurityUtils;
import com.sports.sportsnet.services.TeamDetailService;
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
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Tag(name = "Team Details", description = "Manage a player's list of teams played and playing")
public class TeamDetailController {

    private final TeamDetailService teamDetailService;

    @Operation(summary = "Add a new team for the logged-in player")
    @ApiResponse(responseCode = "200", description = "Entry created")
    @ApiResponse(responseCode = "400", description = "Validation failed!")
    @PostMapping
    public ResponseEntity<TeamDetailResponse> add(@Valid @RequestBody TeamDetailRequest request) {
        return ResponseEntity.ok(teamDetailService.add(SecurityUtils.getCurrentUserEmail(), request));
    }

    @Operation(summary = "Update one of the logged-in player's team")
    @ApiResponse(responseCode = "200", description = "Entry updated")
    @ApiResponse(responseCode = "400", description = "Record not found or does not belong to this user")
    @PutMapping("/{id}")
    public ResponseEntity<TeamDetailResponse> update(
            @Parameter(description = "ID of the team detail entry to update") @PathVariable UUID id,
            @Valid @RequestBody TeamDetailRequest request) {
        return ResponseEntity.ok(teamDetailService.update(SecurityUtils.getCurrentUserEmail(), id, request));
    }

    @Operation(summary = "Delete team detail entries of the logged-in player")
    @ApiResponse(responseCode = "204", description = "Entry deleted")
    @ApiResponse(responseCode = "400", description = "Record not found or does not belong to this user")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID of the team detail entry to delete") @PathVariable UUID id) {
        teamDetailService.delete(SecurityUtils.getCurrentUserEmail(), id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "List all team detail entries for the logged-in player")
    @ApiResponse(responseCode = "200", description = "List of the current user's team details")
    @GetMapping("/me")
    public ResponseEntity<List<TeamDetailResponse>> getMine() {
        return ResponseEntity.ok(teamDetailService.getMine(SecurityUtils.getCurrentUserEmail()));
    }

    @Operation(summary = "List all team detail entries for a given user by ID")
    @ApiResponse(responseCode = "200", description = "List of that user's entries")
    @GetMapping("/{userId}")
    public ResponseEntity<List<TeamDetailResponse>> getByUser(
            @Parameter(description = "UUID of the user whose entries to fetch") @PathVariable UUID userId) {
        return ResponseEntity.ok(teamDetailService.getByUserId(userId));
    }
}