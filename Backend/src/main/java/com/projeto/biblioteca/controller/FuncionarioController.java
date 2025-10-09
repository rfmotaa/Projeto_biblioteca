package com.projeto.biblioteca.controller;

import com.projeto.biblioteca.model.Funcionario;
import com.projeto.biblioteca.service.FuncionarioService;
import com.projeto.biblioteca.service.SistemaLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    @Autowired
    FuncionarioService funcionarioService;
    @Autowired
    SistemaLoginService sistemaLoginService;

    @PostMapping("/login")
    public Map<String, String> login(@RequestParam String login, @RequestParam String senha) {
        Map<String, String> resp = new HashMap<>();
        if (sistemaLoginService.autenticar(login, senha)) {
            resp.put("status", "sucesso");
            resp.put("mensagem", "Login realizado com sucesso");
        } else {
            resp.put("status", "erro");
            resp.put("mensagem", "Login ou senha incorretos");
        }
        return resp;
    }

    @PostMapping("/logout")
    public String logout() {
        sistemaLoginService.logout();
        return "Logout realizado com sucesso.";
    }

    @GetMapping("/autenticado")
    public ResponseEntity<Funcionario> getFuncionarioAutenticado() {
        Funcionario f = sistemaLoginService.getFuncionarioAutenticado();
        if (f == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(f);
    }

    @GetMapping()
    public List<Funcionario> getAll() {
        return funcionarioService.listarTodos();
    }

    @PostMapping()
    public Funcionario postFuncionario(@RequestBody Funcionario funcionario) {
        return funcionarioService.criar(funcionario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> getFuncionarioById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(funcionarioService.buscarPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{id}")
    public Funcionario putFuncionario(@PathVariable Integer id, @RequestBody Funcionario funcionario) {
        return funcionarioService.salvar(id, funcionario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFuncionario(@PathVariable Integer id) {
        try {
            funcionarioService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
