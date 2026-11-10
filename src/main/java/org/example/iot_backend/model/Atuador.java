package org.example.iot_backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "atuadores")
public class Atuador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_atuador")
    private Long idAtuador;

    @ManyToOne
    @JoinColumn(name = "id_dispositivo_fk")
    private Dispositivo dispositivo;

    public Atuador() {}

    @Column(name = "nome_atuador", nullable = false)
    private String nomeAtuador;

    @Column(name = "status_atual")
    private Boolean statusAtual;

    @Column(name = "ultimo_comando")
    private String ultimoComando;

    public Atuador(Long idAtuador, Dispositivo dispositivo, String nomeAtuador,
                   Boolean statusAtual, String ultimoComando) {
        this.idAtuador = idAtuador;
        this.dispositivo = dispositivo;
        this.nomeAtuador = nomeAtuador;
        this.statusAtual = statusAtual;
        this.ultimoComando = ultimoComando;
    }

    public Long getIdAtuador() {
        return idAtuador;
    }

    public void setIdAtuador(Long idAtuador) {
        this.idAtuador = idAtuador;
    }

    public Dispositivo getDispositivo() {
        return dispositivo;
    }

    public void setDispositivo(Dispositivo dispositivo) {
        this.dispositivo = dispositivo;
    }

    public String getNomeAtuador() {
        return nomeAtuador;
    }

    public void setNomeAtuador(String nomeAtuador) {
        this.nomeAtuador = nomeAtuador;
    }

    public Boolean getStatusAtual() {
        return statusAtual;
    }

    public void setStatusAtual(Boolean statusAtual) {
        this.statusAtual = statusAtual;
    }

    public String getUltimoComando() {
        return ultimoComando;
    }

    public void setUltimoComando(String ultimoComando) {
        this.ultimoComando = ultimoComando;
    }
}
