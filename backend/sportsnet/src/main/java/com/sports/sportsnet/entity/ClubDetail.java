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
public class ClubDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String clubName;

    @Column(length = 1000)
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;
}