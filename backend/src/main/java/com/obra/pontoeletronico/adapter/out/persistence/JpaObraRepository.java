package com.obra.pontoeletronico.adapter.out.persistence;

import com.obra.pontoeletronico.domain.model.Obra;
import com.obra.pontoeletronico.domain.port.out.ObraRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaObraRepository extends JpaRepository<Obra, Long>, ObraRepository {
} 