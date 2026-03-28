package com.projeto.biblioteca.controller;

import com.projeto.biblioteca.dto.LivroRequestDTO;
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
    public Livro criar(@RequestBody LivroRequestDTO dto) {
        return livroService.criarComDTO(dto);
    }

    @GetMapping
    public List<Livro> listarTodos() {
        return livroService.listarTodos();
    }

    @GetMapping("/{id}")
    public Livro buscarPorId(@PathVariable Integer id) {
        return livroService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Livro atualizar(@PathVariable Integer id, @RequestBody LivroRequestDTO dto) {
        return livroService.salvarComDTO(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
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

    // Novos endpoints para os novos campos
    @GetMapping("/autor")
    public List<Livro> buscarPorAutor(@RequestParam String autor) {
        return livroService.buscarPorAutor(autor);
    }

    @GetMapping("/editora")
    public List<Livro> buscarPorEditora(@RequestParam String editora) {
        return livroService.buscarPorEditora(editora);
    }

    @GetMapping("/isbn")
    public Livro buscarPorIsbn(@RequestParam String isbn) {
        return livroService.buscarPorIsbn(isbn);
    }

    @GetMapping("/categoria/{categoriaNome}")
    public List<Livro> buscarPorCategoria(@PathVariable String categoriaNome) {
        return livroService.buscarPorCategoria(categoriaNome);
    }
}
