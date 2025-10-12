package com.projeto.biblioteca.service;

import com.projeto.biblioteca.model.Cliente;
import com.projeto.biblioteca.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public Cliente criar(Cliente cliente) {
        if (clienteRepository.findByEmail(cliente.getEmail()).isPresent()) {
            throw new RuntimeException("Email já está em uso.");
        }

        return clienteRepository.save(cliente);
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente buscarPorId(Integer id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
    }

    public Cliente buscarPorEmail(String email) {
        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
    }

    public Cliente salvar(Integer id, Cliente clienteAtualizado) {
        Cliente clienteExistente = buscarPorId(id);

        if (!clienteExistente.getEmail().equals(clienteAtualizado.getEmail())
                && clienteRepository.findByEmail(clienteAtualizado.getEmail()).isPresent()) {
            throw new RuntimeException("Email já está em uso.");
        }

        clienteExistente.setNome(clienteAtualizado.getNome());
        clienteExistente.setEmail(clienteAtualizado.getEmail());
        clienteExistente.setSenhaHash(clienteAtualizado.getSenhaHash());
        clienteExistente.setStatus(clienteAtualizado.getStatus());

        return clienteRepository.save(clienteExistente);
    }

    public void deletar(Integer id) {
        clienteRepository.deleteById(id);
    }

    public List<Cliente> buscarPorStatus(Cliente.StatusCliente status) {
        return clienteRepository.findByStatus(status);
    }

    public List<Cliente> buscarComEmprestimosEmAberto() {
        return clienteRepository.findClientesComEmprestimosEmAberto();
    }

    public List<Cliente> buscarPorNome(String nome) {
        return clienteRepository.findByNomeContainingIgnoreCase(nome);
    }
}
