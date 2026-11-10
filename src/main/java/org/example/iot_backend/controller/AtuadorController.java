package org.example.iot_backend.controller;

import org.example.iot_backend.model.Atuador;
import org.example.iot_backend.repository.AtuadorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atuadores")
@CrossOrigin(origins = "*")

public class AtuadorController {
    private final AtuadorRepository atuadorRepository;

    public AtuadorController(AtuadorRepository atuadorRepository) {
        this.atuadorRepository = atuadorRepository;
    }

    @GetMapping
    public List<Atuador> listar() {
        return atuadorRepository.findAll();
    }

    @PostMapping
    public Atuador salvar(@RequestBody Atuador atuador) {
        return atuadorRepository.save(atuador);
    }
}
