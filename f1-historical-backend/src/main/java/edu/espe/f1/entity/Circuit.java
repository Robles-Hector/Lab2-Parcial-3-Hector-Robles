package edu.espe.f1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

import lombok.EqualsAndHashCode;

@Entity
@Table(name = "circuits")
@Data
@EqualsAndHashCode(of = "id") 
@NoArgsConstructor
public class Circuit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del circuito es obligatorio")
    private String name;

    @NotBlank(message = "El país es obligatorio")
    private String country;

    @NotBlank(message = "La ciudad es obligatoria")
    private String city;

    private int since;
    private double lat;
    private double lng;
    private int laps;
    private double length;
    private boolean active;

    // Relación M:N con Driver
    // Hibernate crea automáticamente la tabla intermedia "driver_circuits"
    @ManyToMany(mappedBy = "circuits", fetch = FetchType.LAZY)
    @JsonIgnore  // Evita recursión infinita al serializar
    private Set<Driver> drivers = new HashSet<>();
}
