package org.example.iot_backend.repository;

import org.example.iot_backend.model.Atuador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AtuadorRepository extends JpaRepository<Atuador, Long> {}
