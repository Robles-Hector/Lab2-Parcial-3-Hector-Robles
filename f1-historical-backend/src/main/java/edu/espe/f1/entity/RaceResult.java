package edu.espe.f1.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Entity
@Table(name = "race_results")
@Data
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
public class RaceResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    private Integer gridPosition;

    private Integer finalPosition;

    @NotNull(message = "Los puntos son obligatorios")
    private BigDecimal points;

    @NotBlank(message = "El estado del resultado es obligatorio")
    private String status; // FINISHED, DNF, DSQ, etc.

    @Column(name = "fastest_lap", nullable = false)
    private boolean fastestLap = false;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
}