package com.projeto.biblioteca.service;

import com.projeto.biblioteca.model.Emprestimo;
import com.projeto.biblioteca.model.Cliente;
import com.projeto.biblioteca.model.Livro;
import com.projeto.biblioteca.repository.EmprestimoRepository;
import com.projeto.biblioteca.repository.ClienteRepository;
import com.projeto.biblioteca.repository.LivroRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmprestimoService {

    @Autowired
    EmprestimoRepository emprestimoRepository;

    @Autowired
    ClienteRepository clienteRepository;

    @Autowired
    LivroRepository livroRepository;

    // Create a loan request (PENDING status - doesn't reduce book count yet)
    public Emprestimo criarSolicitacao(Emprestimo e) {
        Cliente cliente = clienteRepository.findById(e.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        Livro livro = livroRepository.findById(e.getLivro().getId())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado."));

        if (!livro.disponivel()) {
            throw new RuntimeException("Livro indisponível para empréstimo.");
        }

        // Check if client already has a PENDENTE or ATIVO loan for this book (duplicate)
        long duplicateLoan = emprestimoRepository.countByClienteIdAndLivroIdAndActiveOrPending(
            cliente.getId(),
            livro.getId()
        );
        if (duplicateLoan > 0) {
            throw new RuntimeException("Você já possui uma solicitação ou empréstimo ativo para este livro.");
        }

        // Check if client already has too many active + pending loans (max 3)
        long totalLoans = emprestimoRepository.countActiveAndPendingByClienteId(cliente.getId());
        if (totalLoans >= 3) {
            throw new RuntimeException("Cliente já possui 3 empréstimos ativos/pendentes. Máximo permitido.");
        }

        e.setCliente(cliente);
        e.setLivro(livro);
        e.setDataRetirada(LocalDate.now());
        e.setDataRetornoPrevisto(LocalDate.now().plusDays(7));
        e.setStatus(Emprestimo.StatusEmprestimo.PENDENTE);
        // Don't reduce book count yet - will happen when approved

        return emprestimoRepository.save(e);
    }

    // Approve a pending loan request
    public Emprestimo aprovarSolicitacao(Integer id) {
        Emprestimo emprestimo = buscarPorId(id);

        if (emprestimo.getStatus() != Emprestimo.StatusEmprestimo.PENDENTE) {
            throw new RuntimeException("Solicitação já foi processada.");
        }

        // Check book availability again
        Livro livro = emprestimo.getLivro();
        if (!livro.disponivel()) {
            throw new RuntimeException("Livro não está mais disponível.");
        }

        // Approve and activate the loan
        emprestimo.setStatus(Emprestimo.StatusEmprestimo.ATIVO);
        livro.emprestar();
        livroRepository.save(livro);

        return emprestimoRepository.save(emprestimo);
    }

    // Reject a pending loan request
    public Emprestimo rejeitarSolicitacao(Integer id) {
        Emprestimo emprestimo = buscarPorId(id);

        if (emprestimo.getStatus() != Emprestimo.StatusEmprestimo.PENDENTE) {
            throw new RuntimeException("Solicitação já foi processada.");
        }

        emprestimo.setStatus(Emprestimo.StatusEmprestimo.REJEITADO);
        return emprestimoRepository.save(emprestimo);
    }

    // List pending loan requests
    public List<Emprestimo> listarPendentes() {
        return emprestimoRepository.findByStatus(Emprestimo.StatusEmprestimo.PENDENTE);
    }

    public Emprestimo criar(Emprestimo e) {
        Cliente cliente = clienteRepository.findById(e.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        Livro livro = livroRepository.findById(e.getLivro().getId())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado."));

        if (!livro.disponivel()) {
            throw new RuntimeException("Livro indisponível para empréstimo.");
        }

        e.setCliente(cliente);
        e.setLivro(livro);
        e.setDataRetirada(LocalDate.now());
        e.setDataRetornoPrevisto(LocalDate.now().plusDays(7));

        livro.emprestar();
        livroRepository.save(livro);

        return emprestimoRepository.save(e);
    }

    public List<Emprestimo> listarTodos() {
        return emprestimoRepository.findAll();
    }

    public Emprestimo buscarPorId(Integer id) {
        return emprestimoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado."));
    }

    public Emprestimo salvar(Integer id, Emprestimo emprestimoAtualizado) {
        Emprestimo emprestimoExistente = buscarPorId(id);

        Cliente cliente = clienteRepository.findById(emprestimoAtualizado.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        Livro livro = livroRepository.findById(emprestimoAtualizado.getLivro().getId())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado."));

        emprestimoExistente.setCliente(cliente);
        emprestimoExistente.setLivro(livro);
        emprestimoExistente.setDataRetirada(emprestimoAtualizado.getDataRetirada());
        emprestimoExistente.setDataRetornoPrevisto(emprestimoAtualizado.getDataRetornoPrevisto());
        emprestimoExistente.setDataRetornoOficial(emprestimoAtualizado.getDataRetornoOficial());

        return emprestimoRepository.save(emprestimoExistente);
    }

    public Emprestimo registrarDevolucao(Integer id) {
        Emprestimo emprestimo = buscarPorId(id);

        if (emprestimo.getDataRetornoOficial() != null) {
            throw new RuntimeException("Devolução já registrada.");
        }

        emprestimo.setDataRetornoOficial(LocalDate.now());
        Livro livro = emprestimo.getLivro();
        livro.devolver();
        livroRepository.save(livro);

        return emprestimoRepository.save(emprestimo);
    }

    public Emprestimo renovar(Integer id) {
        Emprestimo emprestimo = buscarPorId(id);
        emprestimo.renovacao();
        return emprestimoRepository.save(emprestimo);
    }

    public void deletar(Integer id) {
        Emprestimo emprestimo = buscarPorId(id);
        if (emprestimo.getDataRetornoOficial() == null) {
            Livro livro = emprestimo.getLivro();
            livro.devolver();
            livroRepository.save(livro);
        }
        emprestimoRepository.deleteById(id);
    }
}
