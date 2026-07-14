package edu.espe.f1.dto;

import edu.espe.f1.entity.RaceResult;

public class RaceResultMapper {
    public static RaceResultResponseDTO toDTO(RaceResult r) {
        return new RaceResultResponseDTO(
            r.getId(),
            r.getRace().getId(),
            r.getRace().getSeason(),
            r.getRace().getRound(),
            r.getDriver().getId(),
            r.getDriver().getName(),
            r.getTeam().getId(),
            r.getTeam().getName(),
            r.getGridPosition(),
            r.getFinalPosition(),
            r.getPoints(),
            r.getStatus(),
            r.isFastestLap()
        );
    }
}