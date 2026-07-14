package edu.espe.f1.dto;

import edu.espe.f1.entity.Circuit;
import edu.espe.f1.entity.Driver;
import edu.espe.f1.entity.Team;

import java.util.List;

public class DriverMapper {

    public static DriverResponseDTO toDTO(Driver driver) {
        TeamSummaryDTO teamDTO = mapTeamSummary(driver.getCurrentTeam());

        List<CircuitSummaryDTO> circuitsDTO = driver.getCircuits().stream()
                .map(CircuitMapper::toSummaryDTO)
                .toList();

        return new DriverResponseDTO(
                driver.getId(),
                driver.getName(),
                driver.getSlug(),
                driver.getNationality(),
                driver.getBorn(),
                driver.getNumber(),
                driver.isActive(),
                driver.getBio(),
                driver.getWins(),
                driver.getPodiums(),
                driver.getPoles(),
                driver.getPoints(),
                driver.getChampionships(),
                driver.getSeasonsData(),
                teamDTO,
                circuitsDTO
        );
    }

    // Version "resumida", para usar dentro de CircuitResponseDTO o TeamResponseDTO
    // (evita volver a anidar team/circuits completos)
    public static DriverSummaryDTO toSummaryDTO(Driver driver) {
        return new DriverSummaryDTO(
                driver.getId(),
                driver.getName(),
                driver.getSlug(),
                driver.getNationality(),
                driver.getNumber(),
                driver.isActive(),
                driver.getWins(),
                driver.getPodiums(),
                driver.getPoles(),
                driver.getPoints(),
                driver.getChampionships()
        );
    }

    private static TeamSummaryDTO mapTeamSummary(Team team) {
        if (team == null) return null;
        return new TeamSummaryDTO(
                team.getId(),
                team.getName(),
                team.getFullName(),
                team.getColor(),
                team.getBase(),
                team.getFounded(),
                team.getChampionships(),
                team.getWins(),
                team.getStatus().name()
        );
    }
}