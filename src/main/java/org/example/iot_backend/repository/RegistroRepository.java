package org.example.iot_backend.repository;

import org.example.iot_backend.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistroRepository extends JpaRepository<Registro, Long> {}
