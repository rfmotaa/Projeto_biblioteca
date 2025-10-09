package com.projeto.biblioteca.controller;

import com.projeto.biblioteca.model.Emprestimo;
import com.projeto.biblioteca.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {

    @Autowired
    EmprestimoService emprestimoService;

    @PostMapping
    public Emprestimo criarEmprestimo(@RequestBody Emprestimo emprestimo) {
        return emprestimoService.criar(emprestimo);
    }

    @GetMapping
    public List<Emprestimo> listarTodos() {
        return emprestimoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Emprestimo buscarPorId(@PathVariable Integer id) {
        return emprestimoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Emprestimo atualizarEmprestimo(@PathVariable Integer id, @RequestBody Emprestimo emprestimoAtualizado) {
        return emprestimoService.salvar(id, emprestimoAtualizado);
    }

    @PatchMapping("/{id}/devolucao")
    public Emprestimo registrarDevolucao(@PathVariable Integer id) {
        return emprestimoService.registrarDevolucao(id);
    }

    @PatchMapping("/{id}/renovacao")
    public Emprestimo renovarEmprestimo(@PathVariable Integer id) {
        return emprestimoService.renovar(id);
    }

    @DeleteMapping("/{id}")
    public void deletarEmprestimo(@PathVariable Integer id) {
        emprestimoService.deletar(id);
    }
}
