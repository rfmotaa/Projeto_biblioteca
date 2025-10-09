package com.projeto.biblioteca.service;

import com.projeto.biblioteca.model.Livro;
import com.projeto.biblioteca.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    public Livro criar(Livro livro) {
        return livroRepository.save(livro);
    }

    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    public Livro buscarPorId(Integer id) {
        return livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado."));
    }

    public Livro salvar(Integer id, Livro livroAtualizado) {
        Livro livroExistente = buscarPorId(id);

        livroExistente.setTitulo(livroAtualizado.getTitulo());
        livroExistente.setAnoPublicacao(livroAtualizado.getAnoPublicacao());
        livroExistente.setQntTotal(livroAtualizado.getQntTotal());
        livroExistente.setQntDisponivel(livroAtualizado.getQntDisponivel());

        return livroRepository.save(livroExistente);
    }

    public void deletar(Integer id) {
        Livro livro = buscarPorId(id);
        boolean possuiEmprestimosAtivos = livro.getEmprestimos().stream()
                .anyMatch(e -> e.getDataRetornoOficial() == null);

        if (possuiEmprestimosAtivos) {
            throw new RuntimeException("Não é possível excluir o livro, existem empréstimos ativos.");
        }

        livroRepository.deleteById(id);
    }

    public List<Livro> buscarPorTitulo(String titulo) {
        return livroRepository.findByTituloContainingIgnoreCase(titulo);
    }

    public List<Livro> buscarPorAno(int ano) {
        return livroRepository.findByAnoPublicacao(ano);
    }

    public List<Livro> listarDisponiveis() {
        return livroRepository.findByQntDisponivelGreaterThan(0);
    }

    public List<Livro> listarIndisponiveis() {
        return livroRepository.findByQntDisponivelLessThan(1);
    }
}
