package edu.espe.f1.service;

import edu.espe.f1.entity.Circuit;
import edu.espe.f1.entity.Driver;
import edu.espe.f1.repository.CircuitRepository;
import edu.espe.f1.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CircuitService {

    @Autowired
    private CircuitRepository circuitRepository;

    @Autowired
    private DriverRepository driverRepository;

    // Obtener todos los circuitos
    public List<Circuit> getAllCircuits() {
        return circuitRepository.findAll();
    }

    // Obtener circuito por ID
    public Circuit getCircuitById(Long id) {
        return circuitRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Circuito no encontrado con id: " + id
            ));
    }

    // Crear circuito
    public Circuit createCircuit(Circuit circuit) {
        return circuitRepository.save(circuit);
    }

    // Actualizar circuito
    public Circuit updateCircuit(Long id, Circuit details) {
        Circuit circuit = getCircuitById(id);
        circuit.setName(details.getName());
        circuit.setCountry(details.getCountry());
        circuit.setCity(details.getCity());
        circuit.setSince(details.getSince());
        circuit.setLat(details.getLat());
        circuit.setLng(details.getLng());
        circuit.setLaps(details.getLaps());
        circuit.setLength(details.getLength());
        circuit.setActive(details.isActive());
        return circuitRepository.save(circuit);
    }

    // Eliminar circuito
    public void deleteCircuit(Long id) {
        Circuit circuit = getCircuitById(id);
        circuitRepository.delete(circuit);
    }

    // Vincular un piloto a un circuito (agrega la relación en driver_circuits)
    public Circuit linkDriver(Long circuitId, String driverId) {
        Circuit circuit = getCircuitById(circuitId);
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Piloto no encontrado con id: " + driverId
            ));
        driver.getCircuits().add(circuit);
        driverRepository.save(driver);
        return circuit;
    }

    // Desvincular un piloto de un circuito
    public Circuit unlinkDriver(Long circuitId, String driverId) {
        Circuit circuit = getCircuitById(circuitId);
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Piloto no encontrado con id: " + driverId
            ));
        driver.getCircuits().remove(circuit);
        driverRepository.save(driver);
        return circuit;
    }
}
