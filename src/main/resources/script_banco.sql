DROP DATABASE IF EXISTS atmosfera_40
CREATE DATABASE atmosfera_40
USE atmosfera_40
CREATE TABLE dispositivos(
   id_dispositivo INT PRIMARY KEY AUTO_INCREMENT,
   nome_dispositivo VARCHAR(50),
   localizacao VARCHAR(80),
   tipo_dispositivo VARCHAR(50),

   gateway_pai_fk INT NULL,
   FOREIGN KEY (gateway_pai_fk) REFERENCES dispositivos(id_dispositivo);
)
CREATE TABLE atuadores(
   id_atuador INT PRIMARY KEY AUTO_INCREMENT,
   nome_atuador VARCHAR(50),
   status_atual BOOLEAN,
   ultimo_comando DATETIME DEFAULT NOW(),

   id_dispositivo_fk INT,
   FOREIGN KEY (id_dispositivo_fk) REFERENCES dispositivos(id_dispositivo);
)
CREATE TABLE registros(
    id_registro BIGINT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME DEFAULT NOW(),
    temperatura FLOAT,
    umidade FLOAT,
    pressao FLOAT,
    altitude FLOAT,
    luminosidade FLOAT,
    velocidade_vento FLOAT,
    direcao_vento INT,
    intensidade_wifi INT,

    id_dispositivo_fk INT,
    FOREIGN KEY (id_dispositivo_fk) REFERENCES dispositivos(id_dispositivo);
)
INSERT INTO dispositivos(nome_dispositivo, localizacao, tipo_dispositivo, gateway_pai_fk)
    VALUES
        ('DEV-01 | Estação Anchieta Central', '-23.58830607498532, -46.645066535673', 'Gateway', NULL),
        ('DEV-02 | Bloco Eletrônica', '-23.589857124073554, -46.646498164637094', 'Gateway', NULL),
        ('DEV-03 | Lab Mecatrônica', '-23.592726327178802, -46.63901857623824', 'Endpoint', 2),
        ('DEV-04 | Estação Externa', '-23.592726327178802, -46.63901857623824', 'Endpoint', 1);