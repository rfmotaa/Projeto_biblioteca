package com.projeto.biblioteca.repository;

import com.projeto.biblioteca.model.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Integer> {
    List<Emprestimo> findByClienteId(Integer clienteId);
    List<Emprestimo> findByLivroId(Integer livroId);
    List<Emprestimo> findByDataRetiradaBetween(LocalDate inicio, LocalDate fim);
    List<Emprestimo> findByDataRetornoPrevistoBefore(LocalDate data);
    List<Emprestimo> findByDataRetornoOficialIsNull();

    List<Emprestimo> findByStatus(Emprestimo.StatusEmprestimo status);

    @Query("SELECT COUNT(e) FROM Emprestimo e WHERE e.cliente.id = :clienteId AND e.status = :status")
    long countByClienteIdAndStatus(@org.springframework.data.repository.query.Param("clienteId") Integer clienteId,
                                   @org.springframework.data.repository.query.Param("status") Emprestimo.StatusEmprestimo status);

    @Query("SELECT COUNT(e) FROM Emprestimo e WHERE e.cliente.id = :clienteId AND (e.status = 'PENDENTE' OR e.status = 'ATIVO')")
    long countActiveAndPendingByClienteId(@org.springframework.data.repository.query.Param("clienteId") Integer clienteId);

    @Query("SELECT COUNT(e) FROM Emprestimo e WHERE e.cliente.id = :clienteId AND e.livro.id = :livroId AND (e.status = 'PENDENTE' OR e.status = 'ATIVO')")
    long countByClienteIdAndLivroIdAndActiveOrPending(@org.springframework.data.repository.query.Param("clienteId") Integer clienteId,
                                                      @org.springframework.data.repository.query.Param("livroId") Integer livroId);
}
