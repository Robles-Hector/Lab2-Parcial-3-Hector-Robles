package edu.espe.f1.service;

import edu.espe.f1.entity.*;
import edu.espe.f1.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class RaceResultService {

    @Autowired private RaceResultRepository raceResultRepository;
    @Autowired private RaceRepository       raceRepository;
    @Autowired private DriverRepository     driverRepository;
    @Autowired private TeamRepository       teamRepository;

    public List<RaceResult> getAllResults() {
        return raceResultRepository.findByActiveTrue();
    }

    public RaceResult getResultById(Long id) {
        return raceResultRepository.findById(id)
            .filter(RaceResult::isActive)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Resultado no encontrado con id: " + id));
    }

    public List<RaceResult> getResultsByRace(Long raceId) {
        return raceResultRepository.findByRaceIdAndActiveTrue(raceId);
    }

    public List<RaceResult> getResultsByDriver(String driverId) {
        return raceResultRepository.findByDriverIdAndActiveTrue(driverId);
    }

    // ── PROCESO TRANSACCIONAL (Fase 3) ──────────────────────────────
    // Registra el resultado de una carrera y actualiza las estadísticas
    // acumuladas del piloto (puntos, victorias, podios, poles) como una
    // sola unidad de trabajo. Si falla cualquier parte, no debe quedar
    // ni el resultado ni la actualización del piloto a medias.
    @Transactional
    public RaceResult registerRaceResult(Map<String, Object> body) {

        Long   raceId   = Long.parseLong(String.valueOf(body.get("raceId")));
        String driverId = (String) body.get("driverId");
        String teamId   = (String) body.get("teamId");

        Race race = raceRepository.findById(raceId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Carrera no encontrada con id: " + raceId));

        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Piloto no encontrado con id: " + driverId));

        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Equipo no encontrado con id: " + teamId));

        // Regla de negocio: no se puede registrar dos veces al mismo piloto en la misma carrera
        if (raceResultRepository.existsByRaceIdAndDriverIdAndActiveTrue(raceId, driverId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Ya existe un resultado registrado para este piloto en esta carrera");
        }

        Integer gridPosition  = body.get("gridPosition")  != null ? Integer.parseInt(String.valueOf(body.get("gridPosition")))  : null;
        Integer finalPosition = body.get("finalPosition") != null ? Integer.parseInt(String.valueOf(body.get("finalPosition"))) : null;
        BigDecimal points     = new BigDecimal(String.valueOf(body.getOrDefault("points", "0")));
        String status         = (String) body.getOrDefault("status", "FINISHED");
        boolean fastestLap    = Boolean.parseBoolean(String.valueOf(body.getOrDefault("fastestLap", false)));
        boolean pole          = Boolean.parseBoolean(String.valueOf(body.getOrDefault("pole", false)));

        RaceResult result = new RaceResult();
        result.setRace(race);
        result.setDriver(driver);
        result.setTeam(team);
        result.setGridPosition(gridPosition);
        result.setFinalPosition(finalPosition);
        result.setPoints(points);
        result.setStatus(status);
        result.setFastestLap(fastestLap);
        result.setActive(true);

        raceResultRepository.save(result);

        // Actualizar estadísticas acumuladas del piloto
        driver.setPoints(driver.getPoints() + points.doubleValue());
        if (finalPosition != null && finalPosition == 1) {
            driver.setWins(driver.getWins() + 1);
        }
        if (finalPosition != null && finalPosition <= 3) {
            driver.setPodiums(driver.getPodiums() + 1);
        }
        if (pole) {
            driver.setPoles(driver.getPoles() + 1);
        }

        driverRepository.save(driver);

        return result;
    }

    public void deleteResult(Long id) {
        RaceResult result = getResultById(id);
        result.setActive(false);
        raceResultRepository.save(result);
    }
}