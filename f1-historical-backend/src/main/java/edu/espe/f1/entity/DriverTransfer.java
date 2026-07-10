package edu.espe.f1.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "driver_transfers")
@Data
@NoArgsConstructor
public class DriverTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", nullable = false)
    @JsonIgnoreProperties({"circuits", "hibernateLazyInitializer"})
    private Driver driver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "from_team_id")
    @JsonIgnoreProperties({"submittedBy", "pilotsData", "hibernateLazyInitializer"})
    private Team fromTeam;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "to_team_id", nullable = false)
    @JsonIgnoreProperties({"submittedBy", "pilotsData", "hibernateLazyInitializer"})
    private Team toTeam;

    @Column(nullable = false)
    private int season;

    @Column(name = "transfer_date")
    private LocalDateTime transferDate = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transferred_by")
    @JsonIgnoreProperties({"password", "roles", "hibernateLazyInitializer"})
    private User transferredBy;
}
