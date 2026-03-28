package com.projeto.biblioteca.controller;

import com.projeto.biblioteca.dto.LivroInteresseDTO;
import com.projeto.biblioteca.dto.LivroInteresseRequestDTO;
import com.projeto.biblioteca.service.LivroInteresseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interesses")
public class LivroInteresseController {

    @Autowired
    private LivroInteresseService livroInteresseService;

    @PostMapping("/cliente/{clienteId}")
    public ResponseEntity<LivroInteresseDTO> adicionarInteresse(
            @PathVariable Integer clienteId,
            @RequestBody LivroInteresseRequestDTO request) {
        try {
            livroInteresseService.adicionarInteresse(clienteId, request.getLivroId());
            // Retornar a lista atualizada
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/cliente/{clienteId}/livro/{livroId}")
    public ResponseEntity<Void> removerInteresse(
            @PathVariable Integer clienteId,
            @PathVariable Integer livroId) {
        try {
            livroInteresseService.removerInteresse(clienteId, livroId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/cliente/{clienteId}")
    public List<LivroInteresseDTO> listarInteresses(@PathVariable Integer clienteId) {
        return livroInteresseService.listarInteresses(clienteId);
    }

    @GetMapping("/cliente/{clienteId}/verificar/{livroId}")
    public boolean verificarInteresse(
            @PathVariable Integer clienteId,
            @PathVariable Integer livroId) {
        return livroInteresseService.verificarInteresse(clienteId, livroId);
    }
}
