package com.obra.pontoeletronico.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Builder
@Schema(description = "Usuário do sistema")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID do usuário", example = "1")
    private Long id;

    @Column(nullable = false)
    @Schema(description = "Nome do usuário", example = "João da Silva")
    private String nome;
    
    @Column(nullable = false, unique = true)
    @Schema(description = "E-mail do usuário", example = "joao@email.com")
    private String email;
    
    @Column(nullable = false)
    @Schema(description = "Senha do usuário", example = "senha123")
    private String senha;
    
    @Column(nullable = false)
    @Schema(description = "Papel do usuário", example = "ADMIN")
    private String role;
    
    @Column(nullable = false)
    @Schema(description = "Usuário ativo?", example = "true")
    private boolean ativo = true;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Funcionario> funcionarios = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = Instant.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
} 