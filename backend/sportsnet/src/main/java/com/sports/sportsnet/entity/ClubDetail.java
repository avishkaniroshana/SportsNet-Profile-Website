package com.sports.sportsnet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "club_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@ToString(exclude = "sportProfile")
public class ClubDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_profile_id", nullable = false)
    private SportsProfile sportProfile;

    @Column(nullable = false)
    private String clubName;

    @Column(length = 1000)
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;
}


