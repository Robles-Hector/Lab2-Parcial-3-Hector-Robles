package edu.espe.f1.controller;

import edu.espe.f1.entity.Team;
import edu.espe.f1.entity.User;
import edu.espe.f1.service.AuthService;
import edu.espe.f1.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    @Autowired private TeamService  teamService;
    @Autowired private AuthService  authService;

    // GET /api/teams — solo APPROVED
    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    // GET /api/teams/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable String id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    // POST /api/teams — crear equipo aprobado (admin)
    @PostMapping
    public ResponseEntity<Team> createTeam(@Valid @RequestBody Team team) {
        return new ResponseEntity<>(teamService.createTeam(team), HttpStatus.CREATED);
    }

    // PUT /api/teams/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable String id, @Valid @RequestBody Team teamDetails) {
        return ResponseEntity.ok(teamService.updateTeam(id, teamDetails));
    }

    // DELETE /api/teams/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable String id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    // ── POSTULACIONES ─────────────────────────────────────────────

    // POST /api/teams/pending — usuario postula un equipo nuevo
    // Header: Authorization: Bearer <token>
    @PostMapping("/pending")
    public ResponseEntity<Team> submitTeam(
            @RequestBody Map<String, Object> body,
            @RequestHeader("Authorization") String authHeader) {
        User user = authService.getUserFromToken(authHeader);
        return new ResponseEntity<>(teamService.submitTeam(body, user), HttpStatus.CREATED);
    }

    // GET /api/teams/pending — admin ve todos los pendientes
    @GetMapping("/pending")
    public ResponseEntity<List<Team>> getPendingTeams() {
        return ResponseEntity.ok(teamService.getPendingTeams());
    }

    // GET /api/teams/rejected — admin ve todos los rechazados
    @GetMapping("/rejected")
    public ResponseEntity<List<Team>> getRejectedTeams() {
        return ResponseEntity.ok(teamService.getRejectedTeams());
    }

    // GET /api/teams/my-submissions — usuario ve sus propias postulaciones
    // Header: Authorization: Bearer <token>
    @GetMapping("/my-submissions")
    public ResponseEntity<List<Team>> getMySubmissions(
            @RequestHeader("Authorization") String authHeader) {
        User user = authService.getUserFromToken(authHeader);
        return ResponseEntity.ok(teamService.getMySubmissions(user));
    }

    // PUT /api/teams/{id}/approve — admin aprueba e inserta pilotos
    @PutMapping("/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveTeam(@PathVariable String id) {
        Team team = teamService.approveTeam(id);
        return ResponseEntity.ok(Map.of(
            "message", "✅ \"" + team.getName() + "\" aprobado y visible en la parrilla",
            "team",    team
        ));
    }

    // PUT /api/teams/{id}/reject — admin rechaza con motivo opcional
    // Body: { "reason": "Presupuesto insuficiente" }
    @PutMapping("/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectTeam(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.getOrDefault("reason", "") : "";
        Team team = teamService.rejectTeam(id, reason);
        return ResponseEntity.ok(Map.of(
            "message", "❌ \"" + team.getName() + "\" rechazado",
            "team",    team
        ));
    }
}
