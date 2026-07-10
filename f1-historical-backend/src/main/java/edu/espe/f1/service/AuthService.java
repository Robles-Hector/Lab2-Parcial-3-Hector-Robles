package edu.espe.f1.service;

import edu.espe.f1.config.JwtUtil;
import edu.espe.f1.entity.Role;
import edu.espe.f1.entity.User;
import edu.espe.f1.repository.RoleRepository;
import edu.espe.f1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private JwtUtil        jwtUtil;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ── REGISTRO ─────────────────────────────────────────────────
    public Map<String, Object> register(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "El usuario '" + username + "' ya existe");
        }

        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Rol ROLE_USER no encontrado — reinicia el backend"));

        User user = new User();
        user.setUsername(username);
        user.setPassword(encoder.encode(password));
        user.getRoles().add(userRole);
        userRepository.save(user);

        String token = jwtUtil.generateToken(username, "ROLE_USER");
        return Map.of(
            "token",    token,
            "username", username,
            "role",     "ROLE_USER"
        );
    }

    // ── LOGIN ─────────────────────────────────────────────────────
    public Map<String, Object> login(String username, String password) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                "Usuario o contraseña incorrectos"));

        if (!user.isActive()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                "Cuenta desactivada — contacta al administrador");
        }

        if (!encoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                "Usuario o contraseña incorrectos");
        }

        String role = user.hasRole(Role.RoleName.ROLE_ADMIN) ? "ROLE_ADMIN" : "ROLE_USER";
        String token = jwtUtil.generateToken(username, role);

        return Map.of(
            "token",    token,
            "username", username,
            "role",     role
        );
    }

    // ── VALIDAR TOKEN ─────────────────────────────────────────────
    public Map<String, Object> validateToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido o expirado");
        }
        String username = jwtUtil.extractUsername(token);
        String role     = jwtUtil.extractRole(token);
        return Map.of("username", username, "role", role);
    }

    // ── OBTENER USER POR TOKEN ────────────────────────────────────
    public User getUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token requerido");
        }
        String token    = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
    }
}
