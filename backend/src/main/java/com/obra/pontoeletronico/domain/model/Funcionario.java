package com.obra.pontoeletronico.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Data
@NoArgsConstructor
@Table(name = "funcionarios")
@Schema(description = "Funcionário do sistema")
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID do funcionário", example = "1")
    private Long id;
    
    @Column(nullable = false)
    @Schema(description = "Nome do funcionário", example = "Maria Oliveira")
    private String nome;
    
    @Column(nullable = false)
    @Schema(description = "Cargo do funcionário", example = "Pedreiro")
    private String cargo;
    
    @Column(nullable = false, unique = true)
    @Schema(description = "CPF do funcionário", example = "12345678901")
    private String cpf;
    
    @Column(nullable = false)
    @Schema(description = "Telefone do funcionário", example = "(11) 99999-9999")
    private String telefone;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "obra_id")
    private Obra obra;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    
    @OneToMany(mappedBy = "funcionario", cascade = CascadeType.ALL)
    private List<RegistroPonto> registrosPonto = new ArrayList<>();
    
    @Column(nullable = false)
    @Schema(description = "Funcionário ativo?", example = "true")
    private boolean ativo = true;
    
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