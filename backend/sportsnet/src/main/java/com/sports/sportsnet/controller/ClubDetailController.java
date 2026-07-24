package com.sports.sportsnet.controller;

import com.sports.sportsnet.dto.ClubDetailRequest;
import com.sports.sportsnet.dto.ClubDetailResponse;
import com.sports.sportsnet.security.SecurityUtils;
import com.sports.sportsnet.services.ClubDetailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
@Tag(name = "Club Detail", description = "Create, update, and view club details after logging in")
public class ClubDetailController {

    private final ClubDetailService clubDetailService;

    @Operation(summary = "Add a new club detail entry for the logged-in player")
    @ApiResponse(responseCode = "200", description = "Entry created")
    @ApiResponse(responseCode = "400", description = "Validation failed!")
    @ApiResponse(responseCode = "403", description = "User not authorized!")
    @PostMapping
    public ResponseEntity<ClubDetailResponse> add(@Valid @RequestBody ClubDetailRequest request) {
        return ResponseEntity.ok(clubDetailService.add(SecurityUtils.getCurrentUserEmail(), request));
    }

    @Operation(summary = "Update an existing club detail entry for the logged-in player")
    @ApiResponse(responseCode = "200", description = "Entry updated")
    @ApiResponse(responseCode = "400", description = "Validation failed!")
    @ApiResponse(responseCode = "403", description = "User not authorized!")
    @ApiResponse(responseCode = "404", description = "Entry not found!")
    @PutMapping("/{id}")
    public ResponseEntity<ClubDetailResponse> update(@PathVariable UUID id,
                                                     @Valid @RequestBody ClubDetailRequest request) {
        return ResponseEntity.ok(clubDetailService.update(SecurityUtils.getCurrentUserEmail(), id, request));
    }

    @Operation(summary = "Delete an existing club detail entry for the logged-in player")
    @ApiResponse(responseCode = "204", description = "Entry deleted")
    @ApiResponse(responseCode = "403", description = "User not authorized!")
    @ApiResponse(responseCode = "404", description = "Entry not found!")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        clubDetailService.delete(SecurityUtils.getCurrentUserEmail(), id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get all club detail entries for the logged-in player")
    @ApiResponse(responseCode = "200", description = "List of the current user's entries")
    @ApiResponse(responseCode = "403", description = "User not authorized!")
    @ApiResponse(responseCode = "404", description = "Entry not found!")
    @GetMapping("/me")
    public ResponseEntity<List<ClubDetailResponse>> getMine() {
        return ResponseEntity.ok(clubDetailService.getMine(SecurityUtils.getCurrentUserEmail()));
    }

    @Operation(summary = "Get all club detail entries for a specific user")
    @ApiResponse(responseCode = "200", description = "List of the user's entries")
    @ApiResponse(responseCode = "403", description = "User not authorized!")
    @ApiResponse(responseCode = "404", description = "Entry not found!")
    @GetMapping("/{userId}")
    public ResponseEntity<List<ClubDetailResponse>> getByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(clubDetailService.getByUserId(userId));
    }
}