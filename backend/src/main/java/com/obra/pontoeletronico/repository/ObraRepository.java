package com.obra.pontoeletronico.repository;

import com.obra.pontoeletronico.domain.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObraRepository extends JpaRepository<Obra, Long> {
    long countByStatus(Obra.StatusObra status);
} 