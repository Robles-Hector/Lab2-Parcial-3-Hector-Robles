package edu.espe.f1.service;

import edu.espe.f1.entity.Driver;
import edu.espe.f1.entity.DriverTransfer;
import edu.espe.f1.entity.Team;
import edu.espe.f1.entity.User;
import edu.espe.f1.repository.DriverRepository;
import edu.espe.f1.repository.DriverTransferRepository;
import edu.espe.f1.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class DriverService {

    @Autowired private DriverRepository         driverRepository;
    @Autowired private DriverTransferRepository transferRepository;
    @Autowired private TeamRepository           teamRepository;

    // Solo activos
    public List<Driver> getAllDrivers() {
        return driverRepository.findByActiveTrue();
    }

    // Incluye inactivos (para admin)
    public List<Driver> getInactiveDrivers() {
        return driverRepository.findByActiveFalse();
    }

    public Driver getDriverById(String id) {
        return driverRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Piloto no encontrado con id: " + id));
    }

    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public Driver updateDriver(String id, Driver details) {
        Driver driver = getDriverById(id);
        driver.setName(details.getName());
        driver.setSlug(details.getSlug());
        driver.setNationality(details.getNationality());
        driver.setBorn(details.getBorn());
        driver.setNumber(details.getNumber());
        driver.setChampionships(details.getChampionships());
        driver.setWins(details.getWins());
        driver.setPodiums(details.getPodiums());
        driver.setPoles(details.getPoles());
        driver.setPoints(details.getPoints());
        driver.setBio(details.getBio());
        return driverRepository.save(driver);
    }

    // Borrado LÓGICO — no elimina de la BD
    public void deleteDriver(String id) {
        Driver driver = getDriverById(id);
        driver.setActive(false);
        driverRepository.save(driver);
    }

    // Restaurar piloto eliminado (admin)
    public Driver restoreDriver(String id) {
        Driver driver = driverRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Piloto no encontrado con id: " + id));
        driver.setActive(true);
        return driverRepository.save(driver);
    }

    // ── TRANSFERENCIAS ────────────────────────────────────────────

    public DriverTransfer transferDriver(String driverId, Map<String, Object> body, User admin) {
        Driver driver = getDriverById(driverId);

        String toTeamId = (String) body.get("toTeamId");
        int    season   = Integer.parseInt(String.valueOf(body.get("season")));
        String notes    = (String) body.getOrDefault("notes", "");

        Team toTeam = teamRepository.findById(toTeamId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Equipo destino no encontrado: " + toTeamId));

        // Registrar transferencia
        DriverTransfer transfer = new DriverTransfer();
        transfer.setDriver(driver);
        transfer.setFromTeam(driver.getCurrentTeam());
        transfer.setToTeam(toTeam);
        transfer.setSeason(season);
        transfer.setNotes(notes);
        transfer.setTransferredBy(admin);
        transferRepository.save(transfer);

        // Actualizar equipo actual del piloto
        driver.setCurrentTeam(toTeam);
        driverRepository.save(driver);

        return transfer;
    }

    public List<DriverTransfer> getTransferHistory(String driverId) {
        return transferRepository.findByDriverIdOrderByTransferDateDesc(driverId);
    }
}
