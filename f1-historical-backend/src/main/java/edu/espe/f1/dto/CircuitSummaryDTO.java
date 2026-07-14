package edu.espe.f1.dto;

public record CircuitSummaryDTO(
        Long id,
        String name,
        String city,
        String country,
        double lat,
        double lng,
        double length,
        int laps,
        int since,
        boolean active
) {}