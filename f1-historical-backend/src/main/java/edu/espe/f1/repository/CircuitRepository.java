package edu.espe.f1.repository;

import edu.espe.f1.entity.Circuit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CircuitRepository extends JpaRepository<Circuit, Long> {
    // Buscar por nombre exacto (útil para el DataInitializer)
    java.util.Optional<Circuit> findByName(String name);
}
