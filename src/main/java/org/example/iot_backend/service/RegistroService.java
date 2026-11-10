package org.example.iot_backend.service;

import org.example.iot_backend.model.Dispositivo;
import org.example.iot_backend.model.Registro;
import org.example.iot_backend.repository.DispositivoRepository;
import org.example.iot_backend.repository.RegistroRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service

public class RegistroService {

        private final RegistroRepository registroRepository;
        private final DispositivoRepository dispositivoRepository;

        public RegistroService(RegistroRepository registroRepository, DispositivoRepository dispositivoRepository) {
            this.registroRepository = registroRepository;
            this.dispositivoRepository = dispositivoRepository;
        }

        public List<Registro> listarTodos() {
            return registroRepository.findAll();
        }

        public Registro salvarRegistro(Registro registro) {
            if (registro.getDispositivo() == null || registro.getDispositivo().getIdDispositivo() == null) {
                throw new IllegalArgumentException("O registro precisa estar associado a um ID de dispositivo válido!");
            }

            Long dispositivoId = registro.getDispositivo().getIdDispositivo();

            Dispositivo dispositivoEncontrado = dispositivoRepository.findById(dispositivoId)
                    .orElseThrow(() -> new RuntimeException("Dispositivo com ID " + dispositivoId + " não foi encontrado no sistema!"));

            registro.setDispositivo(dispositivoEncontrado);

            if (registro.getDataHora() == null) {
                registro.setDataHora(LocalDateTime.now());
            }

            return registroRepository.save(registro);
        }
    }

