package edu.espe.f1.controller;

import edu.espe.f1.dto.CircuitMapper;
import edu.espe.f1.dto.CircuitResponseDTO;
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
    public ResponseEntity<List<CircuitResponseDTO>> getAllCircuits() {
        List<CircuitResponseDTO> dtos = circuitService.getAllCircuits().stream()
                .map(CircuitMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // GET /api/circuits/{id}
    @GetMapping("/{id}")
    public ResponseEntity<CircuitResponseDTO> getCircuitById(@PathVariable Long id) {
        Circuit circuit = circuitService.getCircuitById(id);
        return ResponseEntity.ok(CircuitMapper.toDTO(circuit));
    }

    // POST /api/circuits
    @PostMapping
    public ResponseEntity<CircuitResponseDTO> createCircuit(@Valid @RequestBody Circuit circuit) {
        Circuit created = circuitService.createCircuit(circuit);
        return new ResponseEntity<>(CircuitMapper.toDTO(created), HttpStatus.CREATED);
    }

    // PUT /api/circuits/{id}
    @PutMapping("/{id}")
    public ResponseEntity<CircuitResponseDTO> updateCircuit(
            @PathVariable Long id,
            @Valid @RequestBody Circuit circuit) {
        Circuit updated = circuitService.updateCircuit(id, circuit);
        return ResponseEntity.ok(CircuitMapper.toDTO(updated));
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
    public ResponseEntity<CircuitResponseDTO> linkDriver(
            @PathVariable Long circuitId,
            @PathVariable String driverId) {
        Circuit updated = circuitService.linkDriver(circuitId, driverId);
        return ResponseEntity.ok(CircuitMapper.toDTO(updated));
    }

    // DELETE /api/circuits/{circuitId}/drivers/{driverId}
    // Desvincula un piloto de un circuito → elimina fila en driver_circuits
    @DeleteMapping("/{circuitId}/drivers/{driverId}")
    public ResponseEntity<CircuitResponseDTO> unlinkDriver(
            @PathVariable Long circuitId,
            @PathVariable String driverId) {
        Circuit updated = circuitService.unlinkDriver(circuitId, driverId);
        return ResponseEntity.ok(CircuitMapper.toDTO(updated));
    }
}