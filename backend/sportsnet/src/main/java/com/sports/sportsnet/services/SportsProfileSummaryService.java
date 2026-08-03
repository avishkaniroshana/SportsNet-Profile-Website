package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.ProfileSummaryResponse;
import com.sports.sportsnet.repository.SportsProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SportsProfileSummaryService {

    private final SportsProfileRepository sportsProfileRepository;

    public Page<ProfileSummaryResponse> getAllProfileSummaries(Pageable pageable) {
        return sportsProfileRepository.findAllSummaries(pageable);
    }
}


