package edu.espe.f1.controller;

import edu.espe.f1.entity.Driver;
import edu.espe.f1.entity.DriverTransfer;
import edu.espe.f1.entity.User;
import edu.espe.f1.service.AuthService;
import edu.espe.f1.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    @Autowired private DriverService driverService;
    @Autowired private AuthService   authService;

    // GET /api/drivers — solo activos
    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    // GET /api/drivers/inactive — solo admin
    @GetMapping("/inactive")
    public ResponseEntity<List<Driver>> getInactiveDrivers() {
        return ResponseEntity.ok(driverService.getInactiveDrivers());
    }

    // GET /api/drivers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable String id) {
        return ResponseEntity.ok(driverService.getDriverById(id));
    }

    // POST /api/drivers
    @PostMapping
    public ResponseEntity<Driver> createDriver(@Valid @RequestBody Driver driver) {
        return new ResponseEntity<>(driverService.createDriver(driver), HttpStatus.CREATED);
    }

    // PUT /api/drivers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(
            @PathVariable String id,
            @Valid @RequestBody Driver driverDetails) {
        return ResponseEntity.ok(driverService.updateDriver(id, driverDetails));
    }

    // DELETE /api/drivers/{id} — borrado LÓGICO
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDriver(@PathVariable String id) {
        driverService.deleteDriver(id);
        return ResponseEntity.ok(Map.of("message", "Piloto desactivado correctamente"));
    }

    // PUT /api/drivers/{id}/restore — restaurar piloto (admin)
    @PutMapping("/{id}/restore")
    public ResponseEntity<Driver> restoreDriver(@PathVariable String id) {
        return ResponseEntity.ok(driverService.restoreDriver(id));
    }

    // ── TRANSFERENCIAS ────────────────────────────────────────────

    // POST /api/drivers/{id}/transfer
    // Header: Authorization: Bearer <token>
    // Body: { "toTeamId": "mercedes", "season": 2027, "notes": "..." }
    @PostMapping("/{id}/transfer")
    public ResponseEntity<DriverTransfer> transferDriver(
            @PathVariable String id,
            @RequestBody Map<String, Object> body,
            @RequestHeader("Authorization") String authHeader) {
        User admin = authService.getUserFromToken(authHeader);
        return ResponseEntity.ok(driverService.transferDriver(id, body, admin));
    }

    // GET /api/drivers/{id}/transfers — historial de transferencias
    @GetMapping("/{id}/transfers")
    public ResponseEntity<List<DriverTransfer>> getTransferHistory(@PathVariable String id) {
        return ResponseEntity.ok(driverService.getTransferHistory(id));
    }
}
