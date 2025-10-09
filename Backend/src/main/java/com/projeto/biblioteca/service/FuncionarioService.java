package com.projeto.biblioteca.service;

import com.projeto.biblioteca.model.Funcionario;
import com.projeto.biblioteca.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    FuncionarioRepository funcionarioRepository;

    public Funcionario criar(Funcionario f) {
        if (funcionarioRepository.existsById(f.getId())) {
            throw new RuntimeException("Funcionário já cadastrado");
        }

        if (funcionarioRepository.findByLogin(f.getLogin()).isPresent()) {
            throw  new RuntimeException("Login já está em uso.");
        }

        return funcionarioRepository.save(f);
    }

    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public Funcionario buscarPorId(Long id) {
        return funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));
    }

    public Funcionario salvar(Long id, Funcionario funcionarioAtualizado) {
        Funcionario funcionarioExistente = buscarPorId(id);

        if (!funcionarioExistente.getLogin().equals(funcionarioAtualizado.getLogin())
                && funcionarioRepository.existsByLogin(funcionarioAtualizado.getLogin())) {
            throw new RuntimeException("Login já está em uso.");
        }

        funcionarioExistente.setNome(funcionarioAtualizado.getNome());
        funcionarioExistente.setLogin(funcionarioAtualizado.getLogin());
        funcionarioExistente.setSenha(funcionarioAtualizado.getSenha());

        return funcionarioRepository.save(funcionarioExistente);
    }

    public void deletar(Long id) {
        funcionarioRepository.deleteById(id);
    }
}
