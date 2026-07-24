package com.sports.sportsnet.controller;

import com.sports.sportsnet.dto.EducationalDetailRequest;
import com.sports.sportsnet.dto.EducationalDetailResponse;
import com.sports.sportsnet.security.SecurityUtils;
import com.sports.sportsnet.services.EducationalDetailService;
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
@RequestMapping("/api/education")
@RequiredArgsConstructor
@Tag(name = "Educational Details", description = "Manage a player's list of schools/universities attended")
public class EducationalDetailController {

    private final EducationalDetailService educationalDetailService;

    @Operation(summary = "Add a new educational detail entry for the logged-in player")
    @ApiResponse(responseCode = "200", description = "Educational entry created")
    @ApiResponse(responseCode = "400", description = "Validation failed!")
    @PostMapping
    public ResponseEntity<EducationalDetailResponse> add(@Valid @RequestBody EducationalDetailRequest request) {
        return ResponseEntity.ok(educationalDetailService.add(SecurityUtils.getCurrentUserEmail(), request));
    }

    @Operation(summary = "Update educational detail entries of the logged-in player")
    @ApiResponse(responseCode = "200", description = "Entry updated")
    @ApiResponse(responseCode = "400", description = "Record not found or does not belong to this user@!")
    @PutMapping("/{id}")
    public ResponseEntity<EducationalDetailResponse> update(
            @Parameter(description = "ID of the educational detail entry to update") @PathVariable UUID id,
            @Valid @RequestBody EducationalDetailRequest request) {
        return ResponseEntity.ok(educationalDetailService.update(SecurityUtils.getCurrentUserEmail(), id, request));
    }

    @Operation(summary = "Delete educational detail entries of the logged-in player's")
    @ApiResponse(responseCode = "204", description = "Entry deleted")
    @ApiResponse(responseCode = "400", description = "Record not found or does not belong to this user")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID of the educational detail entry to delete") @PathVariable UUID id) {
        educationalDetailService.delete(SecurityUtils.getCurrentUserEmail(), id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "All educational details for the logged-in player")
    @ApiResponse(responseCode = "200", description = "List of the current user's entries")
    @GetMapping("/me")
    public ResponseEntity<List<EducationalDetailResponse>> getMine() {
        return ResponseEntity.ok(educationalDetailService.getMine(SecurityUtils.getCurrentUserEmail()));
    }

    @Operation(summary = "List all educational detail entries for a given user by ID")
    @ApiResponse(responseCode = "200", description = "List of that user's entries")
    @GetMapping("/{userId}")
    public ResponseEntity<List<EducationalDetailResponse>> getByUser(
            @Parameter(description = "UUID of the user to fetch educational details") @PathVariable UUID userId) {
        return ResponseEntity.ok(educationalDetailService.getByUserId(userId));
    }
}