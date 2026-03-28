package com.projeto.biblioteca.service;

import com.projeto.biblioteca.exception.CategoriaEmUsoException;
import com.projeto.biblioteca.model.Categoria;
import com.projeto.biblioteca.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public Categoria criar(Categoria categoria) {
        if (categoria.getNome() == null || categoria.getNome().trim().isEmpty()) {
            throw new RuntimeException("Nome da categoria não pode ser vazio");
        }

        if (categoriaRepository.existsByNome(categoria.getNome())) {
            throw new RuntimeException("Categoria '" + categoria.getNome() + "' já existe");
        }

        return categoriaRepository.save(categoria);
    }

    public List<Categoria> listarTodos() {
        return categoriaRepository.findAllByOrderByIdAsc();
    }

    public Categoria buscarPorId(Integer id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
    }

    public Categoria atualizar(Integer id, Categoria categoria) {
        Categoria existente = buscarPorId(id);

        if (categoria.getNome() == null || categoria.getNome().trim().isEmpty()) {
            throw new RuntimeException("Nome da categoria não pode ser vazio");
        }

        // Verificar se o novo nome já existe em outra categoria
        if (!existente.getNome().equals(categoria.getNome()) &&
            categoriaRepository.existsByNome(categoria.getNome())) {
            throw new RuntimeException("Categoria '" + categoria.getNome() + "' já existe");
        }

        existente.setNome(categoria.getNome());
        return categoriaRepository.save(existente);
    }

    public void deletar(Integer id) {
        Categoria categoria = buscarPorId(id);

        // Verificar se existem livros associados antes de deletar
        if (!categoria.getLivros().isEmpty()) {
            throw new CategoriaEmUsoException(id, categoria.getLivros().size());
        }

        categoriaRepository.deleteById(id);
    }

    public Categoria buscarPorNome(String nome) {
        return categoriaRepository.findByNome(nome)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
    }
}
