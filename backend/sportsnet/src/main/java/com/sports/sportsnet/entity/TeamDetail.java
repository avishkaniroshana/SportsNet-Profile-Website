package com.sports.sportsnet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "team_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@ToString(exclude = "sportProfile")
public class TeamDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_profile_id", nullable = false)
    private SportsProfile sportProfile;

    @Column(nullable = false)
    private String teamName;

    @Column(length = 1000)
    private String details;

    private LocalDate startDate;
    private LocalDate endDate;
}

