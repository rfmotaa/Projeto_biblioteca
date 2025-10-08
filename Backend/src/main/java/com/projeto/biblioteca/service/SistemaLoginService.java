package com.projeto.biblioteca.service;

import com.projeto.biblioteca.model.Funcionario;
import com.projeto.biblioteca.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SistemaLoginService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    private Funcionario funcionarioAutenticado;
    private long expiracaoLogin;

    private static final long TEMPO_LOGIN_VALIDO = 3600000;

    public boolean autenticar(String login, String senha) {
        Optional<Funcionario> funcionarioOpt = funcionarioRepository.findByLogin(login);

        if (funcionarioOpt.isPresent() && funcionarioOpt.get().verificarSenha(senha)) {
            funcionarioAutenticado = funcionarioOpt.get();
            expiracaoLogin = System.currentTimeMillis() + TEMPO_LOGIN_VALIDO;
            return true;
        }

        return false;
    }

    public void logout() {
        funcionarioAutenticado = null;
        expiracaoLogin = 0;
    }

    public boolean isLogado() {
        if (funcionarioAutenticado == null) return false;

        if (System.currentTimeMillis() > expiracaoLogin) {
            logout();
            return false;
        }

        return true;
    }

    public Funcionario getFuncionarioAutenticado() {
        return isLogado() ? funcionarioAutenticado : null;
    }
}
