package com.projeto.biblioteca.service;

import com.projeto.biblioteca.dto.LivroRequestDTO;
import com.projeto.biblioteca.exception.CategoriaNotFoundException;
import com.projeto.biblioteca.model.Categoria;
import com.projeto.biblioteca.model.Livro;
import com.projeto.biblioteca.repository.CategoriaRepository;
import com.projeto.biblioteca.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public Livro criar(Livro livro) {
        // Validações
        if (livro.getAutor() == null || livro.getAutor().trim().isEmpty()) {
            throw new RuntimeException("Autor é obrigatório");
        }

        if (livro.getQntDisponivel() > livro.getQntTotal()) {
            throw new RuntimeException("Quantidade disponível não pode ser maior que a quantidade total.");
        }

        // Validar ISBN se fornecido
        if (livro.getIsbn() != null && !livro.getIsbn().trim().isEmpty()) {
            String isbnLimpo = livro.getIsbn().replaceAll("[^0-9X]", "");
            if (isbnLimpo.length() != 10 && isbnLimpo.length() != 13) {
                throw new RuntimeException("ISBN deve ter 10 ou 13 dígitos");
            }
            if (livroRepository.existsByIsbn(livro.getIsbn())) {
                throw new RuntimeException("ISBN já cadastrado");
            }
        }

        // Validar edição se fornecida
        if (livro.getEdicao() != null && livro.getEdicao() < 1) {
            throw new RuntimeException("Edição deve ser maior que zero");
        }

        // Set default values if null
        if (livro.getEdicao() == null) {
            livro.setEdicao(1);
        }

        return livroRepository.save(livro);
    }

    /**
     * Cria um livro a partir do DTO, processando as categorias
     */
    public Livro criarComDTO(LivroRequestDTO dto) {
        Livro livro = new Livro();
        livro.setTitulo(dto.getTitulo());
        livro.setIsbn(dto.getIsbn());
        livro.setEditora(dto.getEditora());
        livro.setEdicao(dto.getEdicao() != null ? dto.getEdicao() : 1);
        livro.setAutor(dto.getAutor());
        livro.setAnoPublicacao(dto.getAnoPublicacao());
        livro.setQntTotal(dto.getQntTotal());
        livro.setQntDisponivel(dto.getQntTotal());

        // Processar categorias
        if (dto.getCategoriaIds() != null && !dto.getCategoriaIds().isEmpty()) {
            // Validar limite de categorias
            if (dto.getCategoriaIds().size() > 5) {
                throw new RuntimeException("Um livro não pode ter mais que 5 categorias");
            }

            Set<Categoria> categorias = dto.getCategoriaIds().stream()
                    .map(id -> categoriaRepository.findById(id)
                            .orElseThrow(() -> new CategoriaNotFoundException(id)))
                    .collect(Collectors.toSet());
            livro.setCategorias(categorias);
        }

        return criar(livro);
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

        // Validate that available doesn't exceed total (if both provided)
        if (livroAtualizado.getQntTotal() != null && livroAtualizado.getQntDisponivel() != null) {
            if (livroAtualizado.getQntDisponivel() > livroAtualizado.getQntTotal()) {
                throw new RuntimeException("Quantidade disponível não pode ser maior que a quantidade total.");
            }
        }

        // Only update fields that are not null (partial update support)
        if (livroAtualizado.getTitulo() != null) {
            livroExistente.setTitulo(livroAtualizado.getTitulo());
        }
        if (livroAtualizado.getIsbn() != null) {
            // Validar ISBN único
            if (!livroAtualizado.getIsbn().trim().isEmpty() &&
                !livroAtualizado.getIsbn().equals(livroExistente.getIsbn())) {
                if (livroRepository.existsByIsbn(livroAtualizado.getIsbn())) {
                    throw new RuntimeException("ISBN já cadastrado");
                }
                String isbnLimpo = livroAtualizado.getIsbn().replaceAll("[^0-9X]", "");
                if (isbnLimpo.length() != 10 && isbnLimpo.length() != 13) {
                    throw new RuntimeException("ISBN deve ter 10 ou 13 dígitos");
                }
            }
            livroExistente.setIsbn(livroAtualizado.getIsbn());
        }
        if (livroAtualizado.getAutor() != null) {
            if (livroAtualizado.getAutor().trim().isEmpty()) {
                throw new RuntimeException("Autor não pode ser vazio");
            }
            livroExistente.setAutor(livroAtualizado.getAutor());
        }
        if (livroAtualizado.getEditora() != null) {
            livroExistente.setEditora(livroAtualizado.getEditora());
        }
        if (livroAtualizado.getEdicao() != null) {
            if (livroAtualizado.getEdicao() < 1) {
                throw new RuntimeException("Edição deve ser maior que zero");
            }
            livroExistente.setEdicao(livroAtualizado.getEdicao());
        }
        if (livroAtualizado.getAnoPublicacao() != null) {
            livroExistente.setAnoPublicacao(livroAtualizado.getAnoPublicacao());
        }
        if (livroAtualizado.getQntTotal() != null) {
            livroExistente.setQntTotal(livroAtualizado.getQntTotal());
        }
        if (livroAtualizado.getQntDisponivel() != null) {
            livroExistente.setQntDisponivel(livroAtualizado.getQntDisponivel());
        }
        if (livroAtualizado.getCategorias() != null) {
            livroExistente.setCategorias(livroAtualizado.getCategorias());
        }

        // Final validation
        if (livroExistente.getQntDisponivel() > livroExistente.getQntTotal()) {
            throw new RuntimeException("Quantidade disponível não pode ser maior que a quantidade total.");
        }

        return livroRepository.save(livroExistente);
    }

    /**
     * Atualiza um livro a partir do DTO, processando as categorias
     */
    public Livro salvarComDTO(Integer id, LivroRequestDTO dto) {
        Livro livroExistente = buscarPorId(id);

        // Atualizar campos básicos
        if (dto.getTitulo() != null) {
            livroExistente.setTitulo(dto.getTitulo());
        }
        if (dto.getAutor() != null) {
            if (dto.getAutor().trim().isEmpty()) {
                throw new RuntimeException("Autor não pode ser vazio");
            }
            livroExistente.setAutor(dto.getAutor());
        }
        if (dto.getIsbn() != null) {
            // Validar ISBN único
            if (!dto.getIsbn().trim().isEmpty() &&
                !dto.getIsbn().equals(livroExistente.getIsbn())) {
                if (livroRepository.existsByIsbn(dto.getIsbn())) {
                    throw new RuntimeException("ISBN já cadastrado");
                }
                String isbnLimpo = dto.getIsbn().replaceAll("[^0-9X]", "");
                if (isbnLimpo.length() != 10 && isbnLimpo.length() != 13) {
                    throw new RuntimeException("ISBN deve ter 10 ou 13 dígitos");
                }
            }
            livroExistente.setIsbn(dto.getIsbn());
        }
        if (dto.getEditora() != null) {
            livroExistente.setEditora(dto.getEditora());
        }
        if (dto.getEdicao() != null) {
            if (dto.getEdicao() < 1) {
                throw new RuntimeException("Edição deve ser maior que zero");
            }
            livroExistente.setEdicao(dto.getEdicao());
        }
        if (dto.getAnoPublicacao() != null) {
            livroExistente.setAnoPublicacao(dto.getAnoPublicacao());
        }
        if (dto.getQntTotal() != null) {
            // Calcular nova quantidade disponível
            Integer borrowed = livroExistente.getQntTotal() - livroExistente.getQntDisponivel();
            livroExistente.setQntTotal(dto.getQntTotal());
            livroExistente.setQntDisponivel((short) Math.max(0, dto.getQntTotal() - borrowed));
        }

        // Processar categorias (sempre atualiza quando enviado)
        if (dto.getCategoriaIds() != null) {
            if (dto.getCategoriaIds().isEmpty()) {
                // Se lista vazia, remove todas as categorias
                livroExistente.setCategorias(new HashSet<>());
            } else {
                // Validar limite de categorias
                if (dto.getCategoriaIds().size() > 5) {
                    throw new RuntimeException("Um livro não pode ter mais que 5 categorias");
                }

                Set<Categoria> categorias = dto.getCategoriaIds().stream()
                        .map(catId -> categoriaRepository.findById(catId)
                                .orElseThrow(() -> new CategoriaNotFoundException(catId)))
                        .collect(Collectors.toSet());
                livroExistente.setCategorias(categorias);
            }
        }

        // Final validation
        if (livroExistente.getQntDisponivel() > livroExistente.getQntTotal()) {
            throw new RuntimeException("Quantidade disponível não pode ser maior que a quantidade total.");
        }

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

    // Novos métodos de busca para os novos campos
    public List<Livro> buscarPorAutor(String autor) {
        return livroRepository.findByAutorContainingIgnoreCase(autor);
    }

    public List<Livro> buscarPorEditora(String editora) {
        return livroRepository.findByEditoraContainingIgnoreCase(editora);
    }

    public Livro buscarPorIsbn(String isbn) {
        return livroRepository.findByIsbn(isbn);
    }

    public List<Livro> buscarPorCategoria(String categoriaNome) {
        return livroRepository.findByCategoriasNome(categoriaNome);
    }
}
