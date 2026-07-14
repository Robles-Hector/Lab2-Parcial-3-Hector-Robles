package edu.espe.f1.dto;

import edu.espe.f1.entity.Race;

public class RaceMapper {
    public static RaceResponseDTO toDTO(Race race) {
        return new RaceResponseDTO(
            race.getId(),
            race.getSeason(),
            race.getRound(),
            String.valueOf(race.getCircuit().getId()),
            race.getCircuit().getName(),
            race.getRaceDate(),
            race.getLapsTotal()
        );
    }
}