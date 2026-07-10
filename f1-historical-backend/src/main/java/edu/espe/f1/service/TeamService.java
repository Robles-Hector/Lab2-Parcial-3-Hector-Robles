package edu.espe.f1.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.espe.f1.entity.Driver;
import edu.espe.f1.entity.Team;
import edu.espe.f1.entity.User;
import edu.espe.f1.repository.DriverRepository;
import edu.espe.f1.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class TeamService {

    @Autowired private TeamRepository   teamRepository;
    @Autowired private DriverRepository driverRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    // ── CRUD básico ───────────────────────────────────────────────

    public List<Team> getAllTeams() {
        return teamRepository.findByStatus(Team.TeamStatus.APPROVED);
    }

    public Team getTeamById(String id) {
        return teamRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Escudería no encontrada con ID: " + id));
    }

    public Team createTeam(Team team) {
        if (teamRepository.existsById(team.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "La escudería ya existe con el ID: " + team.getId());
        }
        team.setStatus(Team.TeamStatus.APPROVED);
        return teamRepository.save(team);
    }

    public Team updateTeam(String id, Team teamDetails) {
        Team team = getTeamById(id);
        team.setName(teamDetails.getName());
        team.setFullName(teamDetails.getFullName());
        team.setBase(teamDetails.getBase());
        team.setFounded(teamDetails.getFounded());
        team.setChampionships(teamDetails.getChampionships());
        team.setColor(teamDetails.getColor());
        team.setWins(teamDetails.getWins());
        return teamRepository.save(team);
    }

    public void deleteTeam(String id) {
        teamRepository.delete(getTeamById(id));
    }

    // ── POSTULACIONES ─────────────────────────────────────────────

    // Crear postulación (usuario normal)
    public Team submitTeam(Map<String, Object> body, User submittedBy) {
        Team team = new Team();

        // Generar ID desde el nombre corto
        String teamName = (String) body.get("teamName");
        String teamId   = teamName.toLowerCase()
            .replaceAll("[^a-z0-9]", "-")
            .replaceAll("-+", "-");
        team.setId(teamId);
        team.setName(teamName);
        team.setFullName((String) body.get("fullName"));
        team.setBase((String) body.get("base"));
        team.setFounded(Integer.parseInt(String.valueOf(body.get("founded"))));
        team.setColor((String) body.getOrDefault("color", "#ff0000"));
        team.setChampionships(0);
        team.setWins(0);
        team.setStatus(Team.TeamStatus.PENDING);
        team.setNotes((String) body.getOrDefault("notes", ""));
        team.setSubmittedBy(submittedBy);

        // Serializar pilotos como JSON
        try {
            Object pilots = body.get("pilots");
            team.setPilotsData(mapper.writeValueAsString(pilots));
        } catch (Exception e) {
            team.setPilotsData("[]");
        }

        // Verificar que el ID no exista
        if (teamRepository.existsById(teamId)) {
            team.setId(teamId + "-" + System.currentTimeMillis());
        }

        return teamRepository.save(team);
    }

    // Obtener todos los pendientes (solo admin)
    public List<Team> getPendingTeams() {
        return teamRepository.findByStatus(Team.TeamStatus.PENDING);
    }

    // Obtener rechazados (solo admin)
    public List<Team> getRejectedTeams() {
        return teamRepository.findByStatus(Team.TeamStatus.REJECTED);
    }

    // Obtener postulaciones del usuario actual
    public List<Team> getMySubmissions(User user) {
        return teamRepository.findBySubmittedBy(user);
    }

    // Aprobar equipo → cambia status e inserta pilotos en drivers
    public Team approveTeam(String id) {
        Team team = teamRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Equipo no encontrado: " + id));

        if (team.getStatus() != Team.TeamStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Solo se pueden aprobar equipos en estado PENDING");
        }

        team.setStatus(Team.TeamStatus.APPROVED);
        teamRepository.save(team);

        // Insertar pilotos automáticamente
        insertPilotsFromTeam(team);

        return team;
    }

    // Rechazar equipo con motivo
    public Team rejectTeam(String id, String reason) {
        Team team = teamRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Equipo no encontrado: " + id));

        if (team.getStatus() != Team.TeamStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Solo se pueden rechazar equipos en estado PENDING");
        }

        team.setStatus(Team.TeamStatus.REJECTED);
        if (reason != null && !reason.isBlank()) {
            team.setNotes(reason);
        }
        return teamRepository.save(team);
    }

    // ── HELPER: insertar pilotos al aprobar equipo ────────────────
    private void insertPilotsFromTeam(Team team) {
        if (team.getPilotsData() == null || team.getPilotsData().isBlank()) return;

        try {
            List<Map<String, Object>> pilots = mapper.readValue(
                team.getPilotsData(),
                new TypeReference<>() {}
            );

            for (int i = 0; i < pilots.size(); i++) {
                Map<String, Object> p = pilots.get(i);
                String name = (String) p.get("name");
                if (name == null || name.isBlank()) continue;

                Driver driver = new Driver();

                // Generar ID y slug desde el nombre
                String slug = name.toLowerCase()
                    .replaceAll("[^a-z0-9]", "-")
                    .replaceAll("-+", "-");
                driver.setId(slug + "-" + System.currentTimeMillis() + i);
                driver.setSlug(slug);
                driver.setName(name);
                driver.setNationality((String) p.getOrDefault("nationality", "Desconocida"));
                driver.setBorn((String) p.getOrDefault("born", ""));
                driver.setNumber(Integer.parseInt(String.valueOf(p.getOrDefault("number", 99))));
                driver.setChampionships(0);
                driver.setWins(0);
                driver.setPodiums(0);
                driver.setPoles(0);
                driver.setPoints(0.0);
                driver.setBio("Piloto incorporado con " + team.getName() + " en 2027.");
                driver.setActive(true);
                driver.setCurrentTeam(team);

                driverRepository.save(driver);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error al insertar pilotos del equipo " + team.getId() + ": " + e.getMessage());
        }
    }
}
