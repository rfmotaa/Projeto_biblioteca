package com.projeto.biblioteca.controller;

import com.projeto.biblioteca.model.Cliente;
import com.projeto.biblioteca.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String senha) {
        Cliente cliente = clienteService
                .listarTodos()
                .stream()
                .filter(c -> c.getEmail().equals(email) && c.verificarSenha(senha))
                .findFirst()
                .orElse(null);

        if (cliente != null) {
            return "Login realizado com sucesso para: " + cliente.getNome();
        }
        return "Email ou senha incorretos.";
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
    public Cliente getClienteById(@PathVariable Long id) {
        return clienteService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Cliente putCliente(@PathVariable Long id, @RequestBody Cliente cliente) {
        return clienteService.salvar(id, cliente);
    }

    @DeleteMapping("/{id}")
    public String deleteCliente(@PathVariable Long id) {
        clienteService.deletar(id);
        return "Cliente removido com sucesso.";
    }

    @GetMapping("/status/{status}")
    public List<Cliente> getByStatus(@PathVariable Cliente.StatusCliente status) {
        return clienteService.buscarPorStatus(status);
    }

    @GetMapping("/nome/{nome}")
    public List<Cliente> getByNome(@PathVariable String nome) {
        return clienteService.buscarPorNome(nome);
    }

    @GetMapping("/emprestimos/abertos")
    public List<Cliente> getClientesComEmprestimosAbertos() {
        return clienteService.buscarComEmprestimosEmAberto();
    }
}
