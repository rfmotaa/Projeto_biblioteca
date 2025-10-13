package com.projeto.biblioteca.controller;

import com.projeto.biblioteca.dto.ClienteDTO;
import com.projeto.biblioteca.dto.EmprestimoDTO;
import com.projeto.biblioteca.dto.LivroDTO;
import com.projeto.biblioteca.model.Cliente;
import com.projeto.biblioteca.model.Emprestimo;
import com.projeto.biblioteca.model.Livro;
import com.projeto.biblioteca.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

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
    public List<EmprestimoDTO> listarTodos() {
        List<Emprestimo> emprestimos = emprestimoService.listarTodos();

        return emprestimos.stream().map(e -> {
            Cliente c = e.getCliente();
            Livro l = e.getLivro();

            ClienteDTO clienteDTO = new ClienteDTO(
                    c.getId(),
                    c.getNome(),
                    c.getEmail(),
                    c.getStatus(),
                    c.getEmprestimos()
                            .stream()
                            .map(Emprestimo::getId)
                            .collect(Collectors.toList())
            );

            LivroDTO livroDTO = new LivroDTO(
                    l.getId(),
                    l.getTitulo(),
                    l.getAnoPublicacao(),
                    l.getQntTotal(),
                    l.getQntDisponivel(),
                    l.getEmprestimos()
                            .stream()
                            .map(Emprestimo::getId)
                            .collect(Collectors.toList())
            );

            return new EmprestimoDTO(
                    e.getId(),
                    e.getDataRetirada(),
                    e.getDataRetornoPrevisto(),
                    e.getDataRetornoOficial(),
                    clienteDTO,
                    livroDTO
            );
        }).collect(Collectors.toList()); 
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
