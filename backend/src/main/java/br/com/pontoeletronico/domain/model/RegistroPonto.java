package br.com.pontoeletronico.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "registros_ponto")
public class RegistroPonto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Column(nullable = false)
    private LocalDateTime dataHora;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRegistro tipo;
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "obra_id", nullable = false)
    private Obra obra;
    
    private String observacao;
    
    @Column(nullable = false)
    private boolean registroManual;
    
    public enum TipoRegistro {
        ENTRADA,
        SAIDA_ALMOCO,
        RETORNO_ALMOCO,
        SAIDA
    }
} 