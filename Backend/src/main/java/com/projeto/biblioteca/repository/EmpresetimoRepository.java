package com.projeto.biblioteca.repository;

import com.projeto.biblioteca.model.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmpresetimoRepository extends JpaRepository<Emprestimo, Long> {
    List<Emprestimo> findByStatus(String status);
    List<Emprestimo> findByClienteId(Long clienteId);
    List<Emprestimo> findByLivroId(Long livroId);
    List<Emprestimo> findByDataEmprestimoBetween(LocalDate inicio, LocalDate fim);
    List<Emprestimo> findByDataDevolucaoPrevistaBefore(LocalDate data);
    List<Emprestimo> findByDataDevolucaoRealIsNull();
}
