package com.projeto.biblioteca.repository;

import com.projeto.biblioteca.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long>{

    Optional<Funcionario> findByLogin(String login);
    boolean existsByLogin(String login);
    List<Funcionario> findByNomeContainingIgnoreCase(String nome);
}