package com.projeto.biblioteca.service;

import com.projeto.biblioteca.model.Cliente;
import com.projeto.biblioteca.model.Funcionario;
import com.projeto.biblioteca.repository.ClienteRepository;
import com.projeto.biblioteca.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SistemaLoginService {

    @Autowired
    FuncionarioRepository funcionarioRepository;
    @Autowired
    ClienteRepository clienteRepository;

    private Funcionario funcionarioAutenticado;
    private Cliente clienteAutenticado;
    
    private long expiracaoLoginFuncionario;
    private long expiracaoLoginCliente;

    private static final long TEMPO_LOGIN_VALIDO = 3600000;

    public boolean autenticarFuncionario(String login, String senha) {
        Optional<Funcionario> funcionarioOpt = funcionarioRepository.findByLogin(login);

        if (funcionarioOpt.isPresent() && funcionarioOpt.get().verificarSenha(senha)) {
            funcionarioAutenticado = funcionarioOpt.get();
            expiracaoLoginFuncionario = System.currentTimeMillis() + TEMPO_LOGIN_VALIDO;
            return true;
        }

        return false;
    }

    public void logoutFuncionario() {
        funcionarioAutenticado = null;
        expiracaoLoginFuncionario = 0;
    }

    public boolean funcionarioIsLogado() {
        if (funcionarioAutenticado == null) return false;

        if (System.currentTimeMillis() > expiracaoLoginFuncionario) {
            logoutFuncionario();
            return false;
        }

        return true;
    }

    public Funcionario getFuncionarioAutenticado() {
        return funcionarioIsLogado() ? funcionarioAutenticado : null;
    }

    public boolean autenticarCliente(String email, String senha) {
        Optional<Cliente> clienteOpt = clienteRepository.findByEmail(email);

        if (clienteOpt.isPresent() && clienteOpt.get().verificarSenha(senha)) {
            clienteAutenticado = clienteOpt.get();
            expiracaoLoginCliente = System.currentTimeMillis() + TEMPO_LOGIN_VALIDO;
            return true;
        }

        return false;
    }

    public void logoutCliente() {
        clienteAutenticado = null;
        expiracaoLoginCliente = 0;
    }

    public boolean clienteIsLogado() {
        if (clienteAutenticado == null) return false;

        if (System.currentTimeMillis() > expiracaoLoginCliente) {
            logoutCliente();
            return false;
        }

        return true;
    }

    public Cliente getClienteAutenticado() {
        return clienteIsLogado() ? clienteAutenticado : null;
    }
}
