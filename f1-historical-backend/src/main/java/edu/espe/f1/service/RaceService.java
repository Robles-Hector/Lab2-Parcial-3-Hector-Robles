package edu.espe.f1.service;

import edu.espe.f1.entity.Circuit;
import edu.espe.f1.entity.Race;
import edu.espe.f1.repository.CircuitRepository;
import edu.espe.f1.repository.RaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RaceService {

    @Autowired private RaceRepository    raceRepository;
    @Autowired private CircuitRepository circuitRepository;

    public List<Race> getAllRaces() {
        return raceRepository.findAll();
    }

    public Race getRaceById(Long id) {
        return raceRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Carrera no encontrada con id: " + id));
    }

    public List<Race> getRacesBySeason(Integer season) {
        return raceRepository.findBySeasonOrderByRoundAsc(season);
    }

    public Race createRace(Race race) {
        Circuit circuit = circuitRepository.findById(race.getCircuit().getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Circuito no encontrado con id: " + race.getCircuit().getId()));
        race.setCircuit(circuit);

        boolean roundExists = raceRepository.findBySeasonOrderByRoundAsc(race.getSeason()).stream()
            .anyMatch(r -> r.getRound().equals(race.getRound()));
        if (roundExists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Ya existe una carrera en la temporada " + race.getSeason() + " con la ronda " + race.getRound());
        }

        return raceRepository.save(race);
    }

    public Race updateRace(Long id, Race details) {
        Race race = getRaceById(id);

        if (details.getCircuit() != null && details.getCircuit().getId() != null) {
            Circuit circuit = circuitRepository.findById(details.getCircuit().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Circuito no encontrado con id: " + details.getCircuit().getId()));
            race.setCircuit(circuit);
        }

        race.setSeason(details.getSeason());
        race.setRound(details.getRound());
        race.setRaceDate(details.getRaceDate());
        race.setLapsTotal(details.getLapsTotal());

        return raceRepository.save(race);
    }

    public void deleteRace(Long id) {
        raceRepository.delete(getRaceById(id));
    }
}