package com.sports.sportsnet.controller;

import com.sports.sportsnet.dto.ProfileSummaryResponse;
import com.sports.sportsnet.services.SportsProfileService;
import com.sports.sportsnet.services.SportsProfileSummaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profiles-summary")
@RequiredArgsConstructor
@Tag(name = "Sports Profile Summary", description = "Get all profiles summary with pagination, this is a public one for everyone")
public class SportsProfileSummaryController {

    private final SportsProfileSummaryService sportsProfileSummaryService;

    @Operation(summary = "List all player profile summaries, paginated")
    @ApiResponse(responseCode = "200", description = "Paginated list of player summaries")
    @GetMapping
    public ResponseEntity<Page<ProfileSummaryResponse>> getAllProfileSummaries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProfileSummaryResponse> profiles = sportsProfileSummaryService.getAllProfileSummaries(pageable);
        return ResponseEntity.ok(profiles);
    }


}
