package com.projeto.biblioteca.repository;

import com.projeto.biblioteca.model.LivroInteresse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivroInteresseRepository extends JpaRepository<LivroInteresse, Integer> {

    List<LivroInteresse> findByClienteId(Integer clienteId);

    Optional<LivroInteresse> findByClienteIdAndLivroId(Integer clienteId, Integer livroId);

    void deleteByClienteIdAndLivroId(Integer clienteId, Integer livroId);

    boolean existsByClienteIdAndLivroId(Integer clienteId, Integer livroId);

    List<LivroInteresse> findByLivroId(Integer livroId);
}
