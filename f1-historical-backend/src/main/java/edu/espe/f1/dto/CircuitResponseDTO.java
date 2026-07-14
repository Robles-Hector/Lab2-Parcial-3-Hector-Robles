package edu.espe.f1.dto;

import java.util.List;

public record CircuitResponseDTO(
        Long id,
        String name,
        String city,
        String country,
        double lat,
        double lng,
        double length,
        int laps,
        int since,
        boolean active,
        List<DriverSummaryDTO> drivers
) {}