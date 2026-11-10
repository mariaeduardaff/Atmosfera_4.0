package org.example.iot_backend.service;

import org.example.iot_backend.model.Dispositivo;
import org.example.iot_backend.repository.DispositivoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class DispositivoService {

    private final DispositivoRepository dispositivoRepository;

    public DispositivoService(DispositivoRepository dispositivoRepository) {
        this.dispositivoRepository = dispositivoRepository;
    }

    public List<Dispositivo> listarTodos() {
        return dispositivoRepository.findAll();
    }

    public Dispositivo salvar(Dispositivo dispositivo) {
        return dispositivoRepository.save(dispositivo);
    }
}
