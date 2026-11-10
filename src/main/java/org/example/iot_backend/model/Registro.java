package org.example.iot_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registros")
public class Registro {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id_registro") // 🟢 Mapeia a PK id_registro da imagem
        private Long id;

        private Double temperatura;
        private Double umidade;
        private Double pressao;
        private Double altitude;

        @Column(name = "luminosidade") // 🟢 Mapeia a coluna luminosidade da imagem
        private Double lux;

        @Column(name = "velocidade_vento")
        private Double velocidadeVento;

        @Column(name = "direcao_vento")
        private Integer direcaoVento;

        @Column(name = "intensidade_wifi")
        private Integer intensidadeWifi;

        @Column(name = "data_hora")
        private LocalDateTime dataHora;

        @ManyToOne
        @JoinColumn(name = "id_dispositivo_fk")
        @JsonIgnoreProperties({"registros", "atuadores"})
        private Dispositivo dispositivo;

        public Registro() {}

        // Getters e Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Double getTemperatura() { return temperatura; }
        public void setTemperatura(Double temperatura) { this.temperatura = temperatura; }

        public Double getUmidade() { return umidade; }
        public void setUmidade(Double umidade) { this.umidade = umidade; }

        public Double getPressao() { return pressao; }
        public void setPressao(Double pressao) { this.pressao = pressao; }

        public Double getAltitude() { return altitude; }
        public void setAltitude(Double altitude) { this.altitude = altitude; }

        public Double getLux() { return lux; }
        public void setLux(Double lux) { this.lux = lux; }

        public Double getVelocidadeVento() { return velocidadeVento; }
        public void setVelocidadeVento(Double velocidadeVento) { this.velocidadeVento = velocidadeVento; }

        public Integer getDirecaoVento() { return direcaoVento; }
        public void setDirecaoVento(Integer direcaoVento) { this.direcaoVento = direcaoVento; }

        public Integer getIntensidadeWifi() { return intensidadeWifi; }
        public void setIntensidadeWifi(Integer intensidadeWifi) { this.intensidadeWifi = intensidadeWifi; }

        public LocalDateTime getDataHora() { return dataHora; }
        public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

        public Dispositivo getDispositivo() { return dispositivo; }
        public void setDispositivo(Dispositivo dispositivo) { this.dispositivo = dispositivo; }
}
