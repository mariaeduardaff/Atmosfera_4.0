package org.example.iot_backend.controller;


import org.example.iot_backend.model.Registro;
import org.example.iot_backend.repository.RegistroRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/registros")
@CrossOrigin(origins = "*")

public class RegistroController {

        private final RegistroRepository registroRepository;

        public RegistroController(RegistroRepository registroRepository) {
            this.registroRepository = registroRepository;
        }

        @GetMapping
        public List<Registro> listarRegistros() {
            return registroRepository.findAll();
        }

        @PostMapping
        public Registro salvar(@RequestBody Registro registro) {
            return registroRepository.save(registro);
        }
    }

