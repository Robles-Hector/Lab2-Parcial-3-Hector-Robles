package edu.espe.f1.repository;

import edu.espe.f1.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, String> {
    List<Driver> findByActiveTrue();

    List<Driver> findByActiveFalse();

    boolean existsByNumberAndActiveTrue(int number);

    List<Driver> findByNameContainingIgnoreCaseAndActiveTrue(String name);
}
