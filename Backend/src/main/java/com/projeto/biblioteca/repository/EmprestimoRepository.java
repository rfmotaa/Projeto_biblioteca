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

    // ========== Queries para Dashboard Analytics ==========

    @Query(value = "SELECT WEEK(e.data_retirada, 1) as semana, " +
                   "YEAR(e.data_retirada) as ano, " +
                   "COUNT(*) as quantidade " +
                   "FROM emprestimo e " +
                   "WHERE e.data_retirada >= DATE_SUB(CURDATE(), INTERVAL :ultimasSemanas WEEK) " +
                   "GROUP BY WEEK(e.data_retirada, 1), YEAR(e.data_retirada) " +
                   "ORDER BY ano DESC, semana DESC", nativeQuery = true)
    List<Object[]> countEmprestimosPorSemana(@org.springframework.data.repository.query.Param("ultimasSemanas") int ultimasSemanas);

    @Query("SELECT e.status, COUNT(e) FROM Emprestimo e GROUP BY e.status")
    List<Object[]> countByStatusGrouped();

    @Query(value = "SELECT l.id_livro as id, l.titulo, COUNT(e.id_emprestimo) as qtd_emprestimos " +
                   "FROM livro l " +
                   "INNER JOIN emprestimo e ON l.id_livro = e.id_livro AND e.status IN ('APROVADO', 'ATIVO', 'FINALIZADO') " +
                   "GROUP BY l.id_livro, l.titulo " +
                   "ORDER BY qtd_emprestimos DESC " +
                   "LIMIT :topN", nativeQuery = true)
    List<Object[]> findLivrosMaisEmprestados(@org.springframework.data.repository.query.Param("topN") int topN);

    @Query("SELECT COUNT(e) FROM Emprestimo e WHERE e.status = 'PENDENTE'")
    long countSolicitados();

    @Query("SELECT COUNT(e) FROM Emprestimo e WHERE e.status = 'REJEITADO'")
    long countNegados();

    @Query("SELECT COUNT(e) FROM Emprestimo e WHERE e.status = 'APROVADO' OR e.status = 'ATIVO' OR e.status = 'FINALIZADO'")
    long countAprovados();
}
