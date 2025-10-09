package com.projeto.biblioteca.controller;

import com.projeto.biblioteca.model.Livro;
import com.projeto.biblioteca.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livros")
public class LivroController {

    @Autowired
    private LivroService livroService;

    @PostMapping
    public Livro criar(@RequestBody Livro livro) {
        return livroService.criar(livro);
    }

    @GetMapping
    public List<Livro> listarTodos() {
        return livroService.listarTodos();
    }

    @GetMapping("/{id}")
    public Livro buscarPorId(@PathVariable Long id) {
        return livroService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Livro atualizar(@PathVariable Long id, @RequestBody Livro livroAtualizado) {
        return livroService.salvar(id, livroAtualizado);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        livroService.deletar(id);
    }

    @GetMapping("/titulo")
    public List<Livro> buscarPorTitulo(@RequestParam String titulo) {
        return livroService.buscarPorTitulo(titulo);
    }

    @GetMapping("/ano")
    public List<Livro> buscarPorAno(@RequestParam int ano) {
        return livroService.buscarPorAno(ano);
    }

    @GetMapping("/disponiveis")
    public List<Livro> listarDisponiveis() {
        return livroService.listarDisponiveis();
    }

    @GetMapping("/indisponiveis")
    public List<Livro> listarIndisponiveis() {
        return livroService.listarIndisponiveis();
    }
}
