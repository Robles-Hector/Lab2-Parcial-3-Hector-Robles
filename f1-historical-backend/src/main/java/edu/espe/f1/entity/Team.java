package edu.espe.f1.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "teams")
@Data
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
public class Team {

    @Id
    private String id;

    @NotBlank(message = "El nombre de la escudería es obligatorio")
    private String name;

    @NotBlank(message = "El nombre completo es obligatorio")
    private String fullName;

    @NotBlank(message = "La sede es obligatoria")
    private String base;

    @Min(value = 1950, message = "Año de fundación inválido")
    private int founded;

    @Min(value = 0)
    private int championships;

    @NotBlank(message = "El color hexadecimal es obligatorio")
    private String color;

    private int wins;

    // ── Nuevos campos para postulaciones ──────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TeamStatus status = TeamStatus.APPROVED;

    // JSON con datos de los pilotos postulados: [{name, nationality, number, born}, ...]
    @Column(name = "pilots_data", columnDefinition = "TEXT")
    private String pilotsData;

    // Notas del postulante o motivo de rechazo del admin
    @Column(columnDefinition = "TEXT")
    private String notes;

    // FK al usuario que postuló (null para equipos del sistema)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by")
    @JsonIgnoreProperties({"password", "roles", "hibernateLazyInitializer"})
    private User submittedBy;

    public enum TeamStatus {
        APPROVED,
        PENDING,
        REJECTED
    }
}
