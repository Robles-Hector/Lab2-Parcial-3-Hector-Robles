package edu.espe.f1.dto;

import java.time.LocalDate;

public record RaceResponseDTO(
    Long id,
    Integer season,
    Integer round,
    String circuitId,
    String circuitName,
    LocalDate raceDate,
    Integer lapsTotal
) {}