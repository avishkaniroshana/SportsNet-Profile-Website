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
@RequestMapping("/api/sport-profiles/{sportProfileId}/clubs")
@RequiredArgsConstructor
@Tag(name = "Club Detail", description = "Create, update, and view club details for a specific sport profile")
public class ClubDetailController {

    private final ClubDetailService clubDetailService;

    @Operation(summary = "Add a new club detail entry under a sport profile")
    @ApiResponse(responseCode = "200", description = "Entry created")
    @ApiResponse(responseCode = "400", description = "Validation failed!")
    @ApiResponse(responseCode = "403", description = "User not authorized!")
    @PostMapping
    public ResponseEntity<ClubDetailResponse> add(@PathVariable UUID sportProfileId,
                                                  @Valid @RequestBody ClubDetailRequest request) {
        return ResponseEntity.ok(clubDetailService.add(SecurityUtils.getCurrentUserEmail(), sportProfileId, request));
    }

    @Operation(summary = "Update an existing club detail entry under a sport profile")
    @ApiResponse(responseCode = "200", description = "Entry updated")
    @ApiResponse(responseCode = "400", description = "Validation failed!")
    @ApiResponse(responseCode = "403", description = "User not authorized!")
    @ApiResponse(responseCode = "404", description = "Entry not found!")
    @PutMapping("/{id}")
    public ResponseEntity<ClubDetailResponse> update(@PathVariable UUID sportProfileId,
                                                     @PathVariable UUID id,
                                                     @Valid @RequestBody ClubDetailRequest request) {
        return ResponseEntity.ok(clubDetailService.update(SecurityUtils.getCurrentUserEmail(), sportProfileId, id, request));
    }

    @Operation(summary = "Delete an existing club detail entry under a sport profile")
    @ApiResponse(responseCode = "204", description = "Entry deleted")
    @ApiResponse(responseCode = "403", description = "User not authorized!")
    @ApiResponse(responseCode = "404", description = "Entry not found!")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID sportProfileId, @PathVariable UUID id) {
        clubDetailService.delete(SecurityUtils.getCurrentUserEmail(), sportProfileId, id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get all club detail entries under a sport profile (public)")
    @ApiResponse(responseCode = "200", description = "List of entries for that sport profile")
    @GetMapping
    public ResponseEntity<List<ClubDetailResponse>> getBySportProfile(@PathVariable UUID sportProfileId) {
        return ResponseEntity.ok(clubDetailService.getBySportProfileId(sportProfileId));
    }
}

