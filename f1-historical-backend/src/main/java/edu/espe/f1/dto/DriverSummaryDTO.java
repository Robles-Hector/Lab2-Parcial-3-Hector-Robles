package edu.espe.f1.dto;

public record DriverSummaryDTO(
        String id,
        String name,
        String slug,
        String nationality,
        int number,
        boolean active,
        int wins,
        int podiums,
        int poles,
        double points,
        int championships
) {}