package edu.espe.f1.dto;

import java.util.List;

public record TeamResponseDTO(
        String id,
        String name,
        String fullName,
        String base,
        int founded,
        int championships,
        String color,
        int wins,
        String status,
        String pilotsData,
        String notes,
        Long submittedById,
        String submittedByUsername,
        List<DriverSummaryDTO> pilots // se llena aparte: Team no tiene relación inversa hacia Driver
) {}