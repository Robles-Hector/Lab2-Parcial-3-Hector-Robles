package edu.espe.f1.repository;

import edu.espe.f1.entity.Team;
import edu.espe.f1.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, String> {
    List<Team> findByStatus(Team.TeamStatus status);
    List<Team> findBySubmittedBy(User user);
}
