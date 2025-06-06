package com.obra.pontoeletronico.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class Obra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String endereco;
    private String cliente;
    private LocalDate dataInicio;
    private LocalDate dataPrevisaoFim;
    private LocalDate dataConclusao;
    @Enumerated(EnumType.STRING)
    private StatusObra status = StatusObra.EM_ANDAMENTO;
    private Double latitude;
    private Double longitude;
    private Integer raioPermitido; // em metros

    public enum StatusObra {
        EM_ANDAMENTO,
        CONCLUIDA,
        PAUSADA,
        CANCELADA
    }
} 