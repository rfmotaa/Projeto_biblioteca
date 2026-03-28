package com.projeto.biblioteca.repository;

import com.projeto.biblioteca.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    List<Categoria> findAllByOrderByIdAsc();

    Optional<Categoria> findByNome(String nome);

    boolean existsByNome(String nome);
}
