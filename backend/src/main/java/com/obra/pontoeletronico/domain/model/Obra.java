package com.obra.pontoeletronico.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Data
@NoArgsConstructor
@Table(name = "obras")
@Schema(description = "Obra do sistema")
public class Obra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID da obra", example = "1")
    private Long id;
    
    @Column(nullable = false)
    @Schema(description = "Nome da obra", example = "Construção Sede")
    private String nome;
    
    @Column(nullable = false)
    @Schema(description = "Endereço da obra", example = "Rua das Flores, 123")
    private String endereco;
    
    @Column(name = "data_inicio", nullable = false)
    @Schema(description = "Data de início da obra", example = "2024-01-01")
    private LocalDate dataInicio;
    
    @Column(name = "data_prevista_termino")
    @Schema(description = "Data prevista de término", example = "2024-12-31")
    private LocalDate dataPrevistaTermino;
    
    @Column(nullable = false)
    @Schema(description = "Status da obra", example = "EM_ANDAMENTO")
    private String status;
    
    @OneToMany(mappedBy = "obra", cascade = CascadeType.ALL)
    private List<Funcionario> funcionarios = new ArrayList<>();
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 