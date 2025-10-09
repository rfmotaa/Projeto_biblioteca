package com.projeto.biblioteca.repository;

import com.projeto.biblioteca.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    Optional<Cliente> findByEmailAndSenha(String email, String senha);
    Optional<Cliente> findByEmail(String email);
    List<Cliente> findByStatus(Cliente.StatusCliente status);
    List<Cliente> findByNomeContainingIgnoreCase(String nome);

    @Query("SELECT c FROM Cliente c JOIN c.emprestimo e WHERE e.dataRetornoOficial IS NULL")
    List<Cliente> findClientesComEmprestimosEmAberto();
}