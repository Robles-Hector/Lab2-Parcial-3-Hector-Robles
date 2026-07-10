package edu.espe.f1.controller;

import edu.espe.f1.entity.Circuit;
import edu.espe.f1.service.CircuitService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/circuits")
@CrossOrigin(origins = "*")
public class CircuitController {

    @Autowired
    private CircuitService circuitService;

    // GET /api/circuits
    @GetMapping
    public ResponseEntity<List<Circuit>> getAllCircuits() {
        return ResponseEntity.ok(circuitService.getAllCircuits());
    }

    // GET /api/circuits/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Circuit> getCircuitById(@PathVariable Long id) {
        return ResponseEntity.ok(circuitService.getCircuitById(id));
    }

    // POST /api/circuits
    @PostMapping
    public ResponseEntity<Circuit> createCircuit(@Valid @RequestBody Circuit circuit) {
        return new ResponseEntity<>(circuitService.createCircuit(circuit), HttpStatus.CREATED);
    }

    // PUT /api/circuits/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Circuit> updateCircuit(
            @PathVariable Long id,
            @Valid @RequestBody Circuit circuit) {
        return ResponseEntity.ok(circuitService.updateCircuit(id, circuit));
    }

    // DELETE /api/circuits/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCircuit(@PathVariable Long id) {
        circuitService.deleteCircuit(id);
        return ResponseEntity.noContent().build();
    }

    // POST /api/circuits/{circuitId}/drivers/{driverId}
    // Vincula un piloto a un circuito → inserta fila en driver_circuits
    @PostMapping("/{circuitId}/drivers/{driverId}")
    public ResponseEntity<Circuit> linkDriver(
            @PathVariable Long circuitId,
            @PathVariable String driverId) {
        return ResponseEntity.ok(circuitService.linkDriver(circuitId, driverId));
    }

    // DELETE /api/circuits/{circuitId}/drivers/{driverId}
    // Desvincula un piloto de un circuito → elimina fila en driver_circuits
    @DeleteMapping("/{circuitId}/drivers/{driverId}")
    public ResponseEntity<Circuit> unlinkDriver(
            @PathVariable Long circuitId,
            @PathVariable String driverId) {
        return ResponseEntity.ok(circuitService.unlinkDriver(circuitId, driverId));
    }
}
