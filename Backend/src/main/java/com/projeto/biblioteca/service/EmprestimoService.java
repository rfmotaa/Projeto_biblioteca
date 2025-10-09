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
