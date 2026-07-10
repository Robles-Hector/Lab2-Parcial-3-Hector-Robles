package edu.espe.f1.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.espe.f1.entity.*;
import edu.espe.f1.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private TeamRepository    teamRepository;
    @Autowired private DriverRepository  driverRepository;
    @Autowired private CircuitRepository circuitRepository;
    @Autowired private UserRepository    userRepository;
    @Autowired private RoleRepository    roleRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {

        // ── 0. ROLES Y USUARIO ADMIN ─────────────────────────────
        if (roleRepository.count() == 0) {
            Role userRole  = roleRepository.save(new Role(Role.RoleName.ROLE_USER));
            Role adminRole = roleRepository.save(new Role(Role.RoleName.ROLE_ADMIN));
            System.out.println("✅ Roles insertados: ROLE_USER, ROLE_ADMIN");

            // Crear admin por defecto
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(encoder.encode("admin123"));
            admin.getRoles().add(userRole);
            admin.getRoles().add(adminRole);
            userRepository.save(admin);
            System.out.println("✅ Usuario admin creado (admin / admin123)");
        }

        if (teamRepository.count() > 0
                && driverRepository.count() > 0
                && circuitRepository.count() > 0) {
            System.out.println("✅ Base de datos ya poblada — omitiendo inicialización.");
            return;
        }

        System.out.println("🏎 Inicializando base de datos F1 desde f1Data.json...");

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(
            new ClassPathResource("f1Data.json").getInputStream()
        );

        // ── 1. EQUIPOS ───────────────────────────────────────────
        if (teamRepository.count() == 0) {
            for (JsonNode t : root.get("teams")) {
                Team team = new Team();
                team.setId(t.get("id").asText());
                team.setName(t.get("name").asText());
                team.setFullName(t.get("fullName").asText());
                team.setBase(t.get("base").asText());
                team.setFounded(t.get("founded").asInt());
                team.setChampionships(t.get("championships").asInt());
                team.setColor(t.get("color").asText());
                team.setWins(t.get("wins").asInt());
                team.setStatus(Team.TeamStatus.APPROVED);
                teamRepository.save(team);
            }
            System.out.println("✅ " + teamRepository.count() + " equipos insertados.");
        }

        // ── 2. PILOTOS ───────────────────────────────────────────
        if (driverRepository.count() == 0) {
            int count = 0;
            for (JsonNode d : root.get("drivers")) {
                Driver driver = new Driver();
                driver.setId(d.get("id").asText());
                driver.setName(d.get("name").asText());
                driver.setSlug(d.get("slug").asText());
                driver.setNationality(d.get("nationality").asText());
                driver.setBorn(d.get("born").asText());
                driver.setNumber(d.get("number").asInt());
                driver.setChampionships(d.get("championships").asInt());
                driver.setWins(d.get("wins").asInt());
                driver.setPodiums(d.get("podiums").asInt());
                driver.setPoles(d.get("poles").asInt());
                driver.setPoints(d.get("points").asDouble());
                driver.setBio(d.get("bio").asText());
                driver.setActive(true);

                // Guardar el historial de temporadas como JSON crudo
                JsonNode seasonsNode = d.get("seasons");
                if (seasonsNode != null) {
                    driver.setSeasonsData(seasonsNode.toString());
                }

                String teamId = d.get("teamId").asText();
                teamRepository.findById(teamId).ifPresentOrElse(
                    driver::setCurrentTeam,
                    () -> System.out.println("⚠️  Equipo no encontrado: " + teamId)
                );

                driverRepository.save(driver);
                count++;
            }
            System.out.println("✅ " + count + " pilotos insertados.");
        }

        // ── 3. CIRCUITOS ─────────────────────────────────────────
        if (circuitRepository.count() == 0) {
            for (JsonNode c : root.get("circuits")) {
                Circuit circuit = new Circuit();
                circuit.setName(c.get("name").asText());
                circuit.setCountry(c.get("country").asText());
                circuit.setCity(c.get("city").asText());
                circuit.setSince(c.get("since").asInt());
                circuit.setLat(c.get("lat").asDouble());
                circuit.setLng(c.get("lng").asDouble());
                circuit.setLaps(c.get("laps").asInt());
                circuit.setLength(c.get("length").asDouble());
                circuit.setActive(c.get("active").asBoolean());
                circuitRepository.save(circuit);
            }
            System.out.println("✅ " + circuitRepository.count() + " circuitos insertados.");
        }

        // ── 4. RELACIONES driver_circuits ────────────────────────
        List<Driver>  allDrivers  = driverRepository.findAll();
        List<Circuit> allCircuits = circuitRepository.findAll();

        for (Driver driver : allDrivers) {
            JsonNode driverNode = findDriverNode(root, driver.getId());
            if (driverNode == null) continue;

            JsonNode seasons = driverNode.get("seasons");
            if (seasons == null) continue;

            java.util.Set<Integer> activeYears = new java.util.HashSet<>();
            for (JsonNode s : seasons) activeYears.add(s.get("year").asInt());

            boolean active2020_2026 = activeYears.stream().anyMatch(y -> y >= 2020 && y <= 2026);
            if (active2020_2026) {
                driver.setActive(true); // blindaje: nunca perder este flag al re-guardar
                for (Circuit circuit : allCircuits) {
                    if (circuit.getSince() <= 2026 && circuit.isActive()) {
                        driver.getCircuits().add(circuit);
                    }
                }
                driverRepository.save(driver);
            }
        }

        long total = driverRepository.findAll().stream()
            .mapToLong(d -> d.getCircuits().size()).sum();
        System.out.println("✅ " + total + " relaciones driver_circuits creadas.");

        // Verificación de integridad — confirma que todos quedaron activos
        long activeCount   = driverRepository.findAll().stream().filter(Driver::isActive).count();
        long inactiveCount = driverRepository.count() - activeCount;
        System.out.println("🔍 Verificación: " + activeCount + " pilotos activos, " + inactiveCount + " inactivos.");
        if (inactiveCount > 0) {
            System.out.println("⚠️  ADVERTENCIA: hay pilotos con active=false tras la inicialización.");
        }

        System.out.println("🏁 Inicialización completada.");
    }

    private JsonNode findDriverNode(JsonNode root, String driverId) {
        for (JsonNode d : root.get("drivers")) {
            if (driverId.equals(d.get("id").asText())) return d;
        }
        return null;
    }
}