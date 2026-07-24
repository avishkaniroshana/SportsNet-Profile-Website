package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.EducationalDetailRequest;
import com.sports.sportsnet.dto.EducationalDetailResponse;
import com.sports.sportsnet.entity.EducationalDetail;
import com.sports.sportsnet.entity.User;
import com.sports.sportsnet.repository.EducationalDetailRepository;
import com.sports.sportsnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EducationalDetailService {

    private final EducationalDetailRepository educationalDetailRepository;
    private final UserRepository userRepository;

    public EducationalDetailResponse add(String currentUserEmail, EducationalDetailRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EducationalDetail detail = EducationalDetail.builder()
                .user(user)
                .institutionName(request.getInstitutionName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return toResponse(educationalDetailRepository.save(detail));
    }

    public EducationalDetailResponse update(String currentUserEmail, UUID id, EducationalDetailRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EducationalDetail detail = educationalDetailRepository.findByIdAndUser_UserId(id, user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        detail.setInstitutionName(request.getInstitutionName());
        detail.setDescription(request.getDescription());
        detail.setStartDate(request.getStartDate());
        detail.setEndDate(request.getEndDate());

        return toResponse(educationalDetailRepository.save(detail));
    }

    public void delete(String currentUserEmail, UUID id) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EducationalDetail detail = educationalDetailRepository.findByIdAndUser_UserId(id, user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Record not found"));

        educationalDetailRepository.delete(detail);
    }

    public List<EducationalDetailResponse> getMine(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return getByUserId(user.getUserId());
    }

    public List<EducationalDetailResponse> getByUserId(UUID userId) {
        return educationalDetailRepository.findByUser_UserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private EducationalDetailResponse toResponse(EducationalDetail detail) {
        return EducationalDetailResponse.builder()
                .id(detail.getId().toString())
                .institutionName(detail.getInstitutionName())
                .description(detail.getDescription())
                .startDate(detail.getStartDate())
                .endDate(detail.getEndDate())
                .build();
    }
}