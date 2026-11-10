package org.example.iot_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.awt.*;
import java.net.URI;

@SpringBootApplication
public class IotBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(IotBackendApplication.class, args);
    }

        @EventListener(ApplicationReadyEvent.class)
        public void abrirNavegadorAutomaticamente() {
            System.setProperty("java.awt.headless", "false");

            try {
                if (Desktop.isDesktopSupported()) {
                    Desktop desktop = Desktop.getDesktop();

                    desktop.browse(new URI("http://localhost:8080/dataresult.html"));

                    desktop.browse(new URI("http://localhost:8080/simulator.html"));
                }
            } catch (Exception e) {
                System.err.println("Não foi possível abrir o navegador automaticamente: " + e.getMessage());
            }
        }
}

