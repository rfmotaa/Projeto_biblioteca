package com.projeto.biblioteca.controller;

import com.projeto.biblioteca.dto.NotificacaoDTO;
import com.projeto.biblioteca.service.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notificacoes")
public class NotificacaoController {

    @Autowired
    private NotificacaoService notificacaoService;

    @GetMapping("/cliente/{clienteId}")
    public List<NotificacaoDTO> buscarNaoLidas(@PathVariable Integer clienteId) {
        return notificacaoService.buscarNotificacoesNaoLidas(clienteId);
    }

    @GetMapping("/cliente/{clienteId}/contar")
    public long contarNaoLidas(@PathVariable Integer clienteId) {
        return notificacaoService.contarNaoLidas(clienteId);
    }

    @PatchMapping("/{id}/marcar-lida")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Integer id) {
        notificacaoService.marcarComoLida(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/cliente/{clienteId}/marcar-todas-lidas")
    public ResponseEntity<Void> marcarTodasComoLidas(@PathVariable Integer clienteId) {
        notificacaoService.marcarTodasComoLidas(clienteId);
        return ResponseEntity.ok().build();
    }
}
