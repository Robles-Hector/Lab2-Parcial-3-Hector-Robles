package edu.espe.f1.dto;

import edu.espe.f1.entity.Circuit;

import java.util.List;

public class CircuitMapper {

    public static CircuitResponseDTO toDTO(Circuit circuit) {
        List<DriverSummaryDTO> driversDTO = circuit.getDrivers().stream()
                .map(DriverMapper::toSummaryDTO)
                .toList();

        return new CircuitResponseDTO(
                circuit.getId(),
                circuit.getName(),
                circuit.getCity(),
                circuit.getCountry(),
                circuit.getLat(),
                circuit.getLng(),
                circuit.getLength(),
                circuit.getLaps(),
                circuit.getSince(),
                circuit.isActive(),
                driversDTO
        );
    }

    // Version "resumida", para usar dentro de DriverResponseDTO
    // (evita volver a anidar la lista de drivers)
    public static CircuitSummaryDTO toSummaryDTO(Circuit circuit) {
        return new CircuitSummaryDTO(
                circuit.getId(),
                circuit.getName(),
                circuit.getCity(),
                circuit.getCountry(),
                circuit.getLat(),
                circuit.getLng(),
                circuit.getLength(),
                circuit.getLaps(),
                circuit.getSince(),
                circuit.isActive()
        );
    }
}