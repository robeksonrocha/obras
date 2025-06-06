package com.obra.pontoeletronico.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(name = "funcionarios")
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nome;
    
    @Column(nullable = false)
    private String cargo;
    
    @Column(nullable = false)
    private String cpf;
    
    @Column(nullable = false)
    private String telefone;
    
    @ManyToOne
    @JoinColumn(name = "obra_id")
    private Obra obra;
    
    @Column(nullable = false)
    private boolean ativo = true;
} 