<div align="center">

# Atmosfera 4.0
### Monitoramento e Simulação Ambiental Inteligente (IoT)

![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

<p align="center">
  Plataforma full-stack para coleta, simulação e análise de dados meteorológicos e atmosféricos em tempo real, conectando sensores IoT a uma arquitetura robusta em Spring Boot.
</p>

[Sobre](#-sobre-o-projeto) •
[Funcionalidades](#-funcionalidades) •
[Telas](#-interfaces-do-sistema) •
[Arquitetura](#-arquitetura) •
[Como Rodar](#-como-executar)

</div>

---

## 💡 Sobre o Projeto

O **Atmosfera 4.0** foi desenvolvido para integrar o mundo físico ao digital dentro dos pilares da **Indústria 4.0**. O sistema permite tanto a recepção de telemetria enviada por microcontroladores reais (como ESP32/Arduino) quanto a geração de cenários climáticos através de um **simulador web integrado**, persistindo todo o histórico em banco de dados relacional para consulta e tomada de decisão.

---

## ✨ Funcionalidades

-  **Telemetria IoT:** Recebimento e validação de leituras atmosféricas via API REST.
-  **Simulador Web Integrado:** Geração de dados de sensores diretamente pelo navegador, sem depender de hardware físico para testes.
-  **Painel de Resultados:** Consulta e exibição organizada do histórico de medições armazenadas.
-  **Tratamento de Exceções:** Respostas padronizadas e seguras para falhas de requisição ou dados inválidos.
-  **Persistência Automatizada:** Mapeamento de entidades e criação automática de tabelas via Spring Data JPA e MySQL.

---

##  Interfaces do Sistema

Com o servidor ativo, o sistema disponibiliza três ambientes web prontos para uso:

| Tela | Rota de Acesso | Descrição |
| :--- | :--- | :--- |
| ** Início** | `http://localhost:8080/index.html` | Portal principal de navegação e visão geral do Atmosfera 4.0. |
| ** Simulador** | `http://localhost:8080/simulator.html` | Painel interativo para simular o envio de dados dos sensores IoT. |
| ** Resultados** | `http://localhost:8080/dataresult.html` | Visualização e consulta dos registros salvos no banco de dados. |

---

##  Arquitetura

O back-end segue o padrão de arquitetura em camadas, separando responsabilidades para facilitar a manutenção e escalabilidade:

<details>
<summary><b>📂 Clique para expandir a árvore de diretórios</b></summary>

```text
iot_backend/
├── src/main/java/
│   └── .../
│       ├── controller/             # Camada REST (Recebe requisições HTTP)
│       ├── service/                # Regras de negócio e validações
│       ├── repository/             # Comunicação com o MySQL (Spring Data JPA)
│       ├── model/                  # Entidades do banco de dados
│       ├── exception/              # Manipulador global de erros
│       └── IotBackendApplication   # Classe principal de inicialização
├── src/main/resources/
│   ├── static/
│   │   ├── css/                    # Estilização das páginas
│   │   ├── js/                     # Scripts de consumo da API (Fetch/AJAX)
│   │   ├── index.html
│   │   ├── simulator.html
│   │   └── dataresult.html
│   └── application.properties      # Configurações de banco e porta
└── build.gradle                    # Gerenciamento de dependências
