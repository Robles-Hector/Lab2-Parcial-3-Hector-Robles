package edu.espe.f1.repository;

import edu.espe.f1.entity.RaceResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RaceResultRepository extends JpaRepository<RaceResult, Long> {
    List<RaceResult> findByActiveTrue();
    List<RaceResult> findByRaceIdAndActiveTrue(Long raceId);
    List<RaceResult> findByDriverIdAndActiveTrue(String driverId);
    List<RaceResult> findByTeamIdAndActiveTrue(String teamId);
    boolean existsByRaceIdAndDriverIdAndActiveTrue(Long raceId, String driverId);
}