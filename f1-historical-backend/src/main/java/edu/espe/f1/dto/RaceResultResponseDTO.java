package edu.espe.f1.dto;

import java.math.BigDecimal;

public record RaceResultResponseDTO(
    Long id,
    Long raceId,
    Integer season,
    Integer round,
    String driverId,
    String driverName,
    String teamId,
    String teamName,
    Integer gridPosition,
    Integer finalPosition,
    BigDecimal points,
    String status,
    boolean fastestLap
) {}