package org.example.iot_backend.controller;

import org.example.iot_backend.model.Dispositivo;
import org.example.iot_backend.repository.DispositivoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispositivos")
@CrossOrigin(origins = "*")

public class DispositivoController {
    private final DispositivoRepository dispositivoRepository;

    public DispositivoController(DispositivoRepository dispositivoRepository) {
        this.dispositivoRepository = dispositivoRepository;
    }

    @GetMapping
    public List<Dispositivo> listar() {
        return dispositivoRepository.findAll();
    }

}
