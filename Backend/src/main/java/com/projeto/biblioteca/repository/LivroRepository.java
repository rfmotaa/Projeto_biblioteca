package com.projeto.biblioteca.repository;

import com.projeto.biblioteca.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Integer> {

    List<Livro> findByTituloContainingIgnoreCase(String titulo);
    List<Livro> findByAnoPublicacao(int anoPublicacao);
    List<Livro> findByQntDisponivelGreaterThan(int quantidade);
    List<Livro> findByQntDisponivelLessThan(int quantidade);
}
