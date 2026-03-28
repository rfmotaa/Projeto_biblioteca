package com.projeto.biblioteca.service;

import com.projeto.biblioteca.dto.ClienteDTO;
import com.projeto.biblioteca.dto.LivroDTO;
import com.projeto.biblioteca.dto.LivroInteresseDTO;
import com.projeto.biblioteca.model.Cliente;
import com.projeto.biblioteca.model.Livro;
import com.projeto.biblioteca.model.LivroInteresse;
import com.projeto.biblioteca.repository.ClienteRepository;
import com.projeto.biblioteca.repository.LivroInteresseRepository;
import com.projeto.biblioteca.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LivroInteresseService {

    @Autowired
    private LivroInteresseRepository livroInteresseRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private LivroRepository livroRepository;

    /**
     * Adiciona um livro à lista de interesse do cliente
     */
    @Transactional
    public LivroInteresse adicionarInteresse(Integer clienteId, Integer livroId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Livro livro = livroRepository.findById(livroId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        // Verificar se já existe
        if (livroInteresseRepository.existsByClienteIdAndLivroId(clienteId, livroId)) {
            throw new RuntimeException("Você já marcou este livro com interesse.");
        }

        LivroInteresse interesse = new LivroInteresse(cliente, livro);
        return livroInteresseRepository.save(interesse);
    }

    /**
     * Remove um livro da lista de interesse
     */
    @Transactional
    public void removerInteresse(Integer clienteId, Integer livroId) {
        if (!livroInteresseRepository.existsByClienteIdAndLivroId(clienteId, livroId)) {
            throw new RuntimeException("Interesse não encontrado.");
        }
        livroInteresseRepository.deleteByClienteIdAndLivroId(clienteId, livroId);
    }

    /**
     * Lista todos os interesses de um cliente
     */
    public List<LivroInteresseDTO> listarInteresses(Integer clienteId) {
        List<LivroInteresse> interesses = livroInteresseRepository.findByClienteId(clienteId);
        return interesses.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    /**
     * Verifica se o cliente tem interesse em um livro
     */
    public boolean verificarInteresse(Integer clienteId, Integer livroId) {
        return livroInteresseRepository.existsByClienteIdAndLivroId(clienteId, livroId);
    }

    /**
     * Remove o interesse quando o cliente aluga o livro
     */
    @Transactional
    public void removerInteresseQuandoAlugado(Integer clienteId, Integer livroId) {
        livroInteresseRepository.deleteByClienteIdAndLivroId(clienteId, livroId);
    }

    /**
     * Lista todos os clientes interessados em um livro
     */
    public List<Cliente> listarClientesInteressados(Integer livroId) {
        List<LivroInteresse> interesses = livroInteresseRepository.findByLivroId(livroId);
        return interesses.stream()
                .map(LivroInteresse::getCliente)
                .collect(Collectors.toList());
    }

    private LivroInteresseDTO converterParaDTO(LivroInteresse interesse) {
        ClienteDTO clienteDTO = new ClienteDTO(
                interesse.getCliente().getId(),
                interesse.getCliente().getNome(),
                interesse.getCliente().getEmail(),
                interesse.getCliente().getStatus(),
                null
        );

        LivroDTO livroDTO = new LivroDTO(
                interesse.getLivro().getId(),
                interesse.getLivro().getTitulo(),
                interesse.getLivro().getIsbn(),
                interesse.getLivro().getEditora(),
                interesse.getLivro().getEdicao(),
                interesse.getLivro().getAutor(),
                interesse.getLivro().getAnoPublicacao(),
                interesse.getLivro().getQntTotal(),
                interesse.getLivro().getQntDisponivel(),
                null,
                null
        );

        return new LivroInteresseDTO(
                interesse.getId(),
                clienteDTO,
                livroDTO,
                interesse.getDataCriacao()
        );
    }
}
