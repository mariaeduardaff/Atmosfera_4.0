package org.example.iot_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "dispositivos")
public class Dispositivo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dispositivo")
    private Long idDispositivo;

    @Column(name = "nome_dispositivo", nullable = false)
    private String nomeDispositivo;

    @Column(name = "localizacao")
    private String localizacao;

    @Column(name = "tipo_dispositivo")
    private String tipoDispositivo;

    @Column(name = "gateway_pai_fk")
    private Long gatewayPaifk;

    @OneToMany(mappedBy = "dispositivo")
    @JsonIgnoreProperties("dispositivo")
    private List<Registro> registros;

    public Dispositivo() {}

    public Dispositivo(Long idDispositivo, String nomeDispositivo, String localizacao,
                       String tipoDispositivo, Long gatewayPaifk) {
        this.idDispositivo = idDispositivo;
        this.nomeDispositivo = nomeDispositivo;
        this.localizacao = localizacao;
        this.tipoDispositivo = tipoDispositivo;
        this.gatewayPaifk = gatewayPaifk;
    }

    public Long getIdDispositivo() {
        return idDispositivo;
    }

    public void setIdDispositivo(Long idDispositivo) {
        this.idDispositivo = idDispositivo;
    }

    public String getNomeDispositivo() {
        return nomeDispositivo;
    }

    public void setNomeDispositivo(String nomeDispositivo) {
        this.nomeDispositivo = nomeDispositivo;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public String getTipoDispositivo() {
        return tipoDispositivo;
    }

    public void setTipoDispositivo(String tipoDispositivo) {
        this.tipoDispositivo = tipoDispositivo;
    }

    public Long getGatewayPaifk() {
        return gatewayPaifk;
    }

    public void setGatewayPaifk(Long gatewayPaifk) {
        this.gatewayPaifk = gatewayPaifk;
    }
}
