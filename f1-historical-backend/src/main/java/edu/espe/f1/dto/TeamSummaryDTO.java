package edu.espe.f1.dto;

public record TeamSummaryDTO(
        String id,
        String name,
        String fullName,
        String color,
        String base,
        int founded,
        int championships,
        int wins,
        String status
) {}