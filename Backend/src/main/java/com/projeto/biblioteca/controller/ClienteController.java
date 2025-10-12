package com.projeto.biblioteca.controller;

import com.projeto.biblioteca.model.Cliente;
import com.projeto.biblioteca.service.ClienteService;
import com.projeto.biblioteca.service.SistemaLoginService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    ClienteService clienteService;
    @Autowired
    SistemaLoginService sistemaLoginService;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        Map<String, String> resp = new HashMap<>();
        if (sistemaLoginService.autenticarCliente(email, senha)) {
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
        sistemaLoginService.logoutCliente();
        return "Logout realizado com sucesso";
    }

    @GetMapping
    public List<Cliente> getAll() {
        return clienteService.listarTodos();
    }

    @PostMapping
    public Cliente postCliente(@RequestBody Cliente cliente) {
        return clienteService.criar(cliente);
    }

    @GetMapping("/{id}")
    public Cliente getClienteById(@PathVariable Integer id) {
        return clienteService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Cliente putCliente(@PathVariable Integer id, @RequestBody Cliente cliente) {
        return clienteService.salvar(id, cliente);
    }

    @DeleteMapping("/{id}")
    public String deleteCliente(@PathVariable Integer id) {
        clienteService.deletar(id);
        return "Cliente removido com sucesso.";
    }

    @GetMapping("/status/{status}")
    public List<Cliente> getByStatus(@PathVariable Cliente.StatusCliente status) {
        return clienteService.buscarPorStatus(status);
    }

    @GetMapping("/nome")
    public List<Cliente> getByNome(@RequestParam String nome) {
        return clienteService.buscarPorNome(nome);
    }

    @GetMapping("/emprestimos/abertos")
    public List<Cliente> getClientesComEmprestimosAbertos() {
        return clienteService.buscarComEmprestimosEmAberto();
    }
}
