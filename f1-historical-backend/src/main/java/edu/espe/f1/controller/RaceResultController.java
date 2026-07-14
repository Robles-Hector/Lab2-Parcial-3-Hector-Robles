package edu.espe.f1.controller;

import edu.espe.f1.dto.RaceResultMapper;
import edu.espe.f1.dto.RaceResultResponseDTO;
import edu.espe.f1.entity.RaceResult;
import edu.espe.f1.service.RaceResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/race-results")
@CrossOrigin(origins = "*")
public class RaceResultController {

    @Autowired private RaceResultService raceResultService;

    @GetMapping
    public ResponseEntity<List<RaceResultResponseDTO>> getAllResults() {
        List<RaceResultResponseDTO> dtos = raceResultService.getAllResults().stream()
                .map(RaceResultMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RaceResultResponseDTO> getResultById(@PathVariable Long id) {
        RaceResult result = raceResultService.getResultById(id);
        return ResponseEntity.ok(RaceResultMapper.toDTO(result));
    }

    @GetMapping("/race/{raceId}")
    public ResponseEntity<List<RaceResultResponseDTO>> getResultsByRace(@PathVariable Long raceId) {
        List<RaceResultResponseDTO> dtos = raceResultService.getResultsByRace(raceId).stream()
                .map(RaceResultMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<RaceResultResponseDTO>> getResultsByDriver(@PathVariable String driverId) {
        List<RaceResultResponseDTO> dtos = raceResultService.getResultsByDriver(driverId).stream()
                .map(RaceResultMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<RaceResultResponseDTO> registerResult(@RequestBody Map<String, Object> body) {
        RaceResult created = raceResultService.registerRaceResult(body);
        return new ResponseEntity<>(RaceResultMapper.toDTO(created), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteResult(@PathVariable Long id) {
        raceResultService.deleteResult(id);
        return ResponseEntity.ok(Map.of("message", "Resultado desactivado correctamente"));
    }
}