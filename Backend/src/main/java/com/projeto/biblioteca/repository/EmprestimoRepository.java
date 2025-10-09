package com.projeto.biblioteca.repository;

import com.projeto.biblioteca.model.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Integer> {
    List<Emprestimo> findByClienteId(Long clienteId);
    List<Emprestimo> findByLivroId(Long livroId);
    List<Emprestimo> findByDataRetiradaBetween(LocalDate inicio, LocalDate fim);
    List<Emprestimo> findByDataRetornoPrevistoBefore(LocalDate data);
    List<Emprestimo> findByDataRetornoOficialIsNull();
}
