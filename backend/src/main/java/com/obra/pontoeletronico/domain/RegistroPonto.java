package com.obra.pontoeletronico.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "registros_ponto")
public class RegistroPonto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionario;

    @ManyToOne
    @JoinColumn(name = "obra_id", nullable = false)
    private Obra obra;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRegistro tipo;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    private Double latitude;
    private Double longitude;
    private Boolean dentroDoRaio;
    private Boolean registroManual;
    private String observacao;
    private Double distanciaObra;

    public enum TipoRegistro {
        ENTRADA,
        SAIDA_ALMOCO,
        RETORNO_ALMOCO,
        SAIDA
    }
} 