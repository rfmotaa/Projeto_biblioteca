package com.projeto.biblioteca.controller;

import com.projeto.biblioteca.dto.ClienteDTO;
import com.projeto.biblioteca.dto.EmprestimoDTO;
import com.projeto.biblioteca.dto.EmprestimoRequestDTO;
import com.projeto.biblioteca.dto.LivroDTO;
import com.projeto.biblioteca.model.Cliente;
import com.projeto.biblioteca.model.Emprestimo;
import com.projeto.biblioteca.model.Livro;
import com.projeto.biblioteca.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {

    @Autowired
    private EmprestimoService emprestimoService;

    // ============================================================
    // ENDPOINTS DE CONSULTA
    // ============================================================

    @GetMapping
    public List<EmprestimoDTO> listarTodos() {
        List<Emprestimo> emprestimos = emprestimoService.listarTodos();
        return converterParaDTO(emprestimos);
    }

    @GetMapping("/pendentes")
    public List<EmprestimoDTO> listarPendentes() {
        List<Emprestimo> emprestimos = emprestimoService.listarPendentes();
        return converterParaDTO(emprestimos);
    }

    @GetMapping("/ativos")
    public List<EmprestimoDTO> listarAtivos() {
        List<Emprestimo> emprestimos = emprestimoService.listarAtivos();
        return converterParaDTO(emprestimos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmprestimoDTO> buscarPorId(@PathVariable Integer id) {
        Emprestimo emprestimo = emprestimoService.buscarPorId(id);
        return ResponseEntity.ok(converterParaDTO(emprestimo));
    }

    // ============================================================
    // ENDPOINTS DE CLIENTE - Solicitar Empréstimo
    // ============================================================

    /**
     * POST /emprestimos/solicitacao
     * CLIENTE: Cria uma solicitação de empréstimo (status PENDENTE)
     */
    @PostMapping("/solicitacao")
    public ResponseEntity<EmprestimoDTO> criarSolicitacao(@RequestBody EmprestimoRequestDTO request) {
        Emprestimo emprestimo = emprestimoService.criarSolicitacao(request.getClienteId(), request.getLivroId());
        return ResponseEntity.ok(converterParaDTO(emprestimo));
    }

    // ============================================================
    // ENDPOINTS DE ADMIN - Gerenciar Solicitações
    // ============================================================

    /**
     * PATCH /emprestimos/{id}/aprovar
     * ADMIN: Aprova uma solicitação pendente (PENDENTE → ATIVO)
     */
    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<EmprestimoDTO> aprovarSolicitacao(@PathVariable Integer id) {
        Emprestimo emprestimo = emprestimoService.aprovarSolicitacao(id);
        return ResponseEntity.ok(converterParaDTO(emprestimo));
    }

    /**
     * PATCH /emprestimos/{id}/rejeitar
     * ADMIN: Rejeita uma solicitação pendente (PENDENTE → REJEITADO)
     */
    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<EmprestimoDTO> rejeitarSolicitacao(@PathVariable Integer id) {
        Emprestimo emprestimo = emprestimoService.rejeitarSolicitacao(id);
        return ResponseEntity.ok(converterParaDTO(emprestimo));
    }

    // ============================================================
    // ENDPOINTS DE ADMIN - Criar Empréstimo Diretamente
    // ============================================================

    /**
     * POST /emprestimos
     * ADMIN: Cria empréstimo diretamente (status ATIVO)
     */
    @PostMapping
    public ResponseEntity<EmprestimoDTO> criarDireto(@RequestBody EmprestimoRequestDTO request) {
        Emprestimo emprestimo = emprestimoService.criarDireto(request.getClienteId(), request.getLivroId());
        return ResponseEntity.ok(converterParaDTO(emprestimo));
    }

    // ============================================================
    // ENDPOINTS DE ADMIN - Renovar Empréstimo
    // ============================================================

    /**
     * PATCH /emprestimos/{id}/renovar
     * ADMIN: Renova um empréstimo ativo (+7 dias)
     */
    @PatchMapping("/{id}/renovar")
    public ResponseEntity<EmprestimoDTO> renovar(@PathVariable Integer id) {
        Emprestimo emprestimo = emprestimoService.renovar(id);
        return ResponseEntity.ok(converterParaDTO(emprestimo));
    }

    // ============================================================
    // ENDPOINTS DE ADMIN - Encerrar/Finalizar Empréstimo
    // ============================================================

    /**
     * PATCH /emprestimos/{id}/finalizar
     * ADMIN: Finaliza um empréstimo ativo (devolução)
     */
    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<EmprestimoDTO> finalizar(@PathVariable Integer id) {
        Emprestimo emprestimo = emprestimoService.finalizar(id);
        return ResponseEntity.ok(converterParaDTO(emprestimo));
    }

    // ============================================================
    // ENDPOINTS LEGADOS (para compatibilidade)
    // ============================================================

    /**
     * @deprecated Use PATCH /emprestimos/{id}/finalizar
     */
    @Deprecated
    @PatchMapping("/{id}/devolucao")
    public ResponseEntity<EmprestimoDTO> registrarDevolucao(@PathVariable Integer id) {
        Emprestimo emprestimo = emprestimoService.finalizar(id);
        return ResponseEntity.ok(converterParaDTO(emprestimo));
    }

    /**
     * @deprecated Use PATCH /emprestimos/{id}/renovar
     */
    @Deprecated
    @PatchMapping("/{id}/renovacao")
    public ResponseEntity<EmprestimoDTO> renovacao(@PathVariable Integer id) {
        Emprestimo emprestimo = emprestimoService.renovar(id);
        return ResponseEntity.ok(converterParaDTO(emprestimo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmprestimoDTO> atualizarEmprestimo(
            @PathVariable Integer id,
            @RequestBody EmprestimoRequestDTO request) {
        // Mantido para compatibilidade, mas não deve ser usado no novo fluxo
        Emprestimo emprestimo = emprestimoService.criarDireto(request.getClienteId(), request.getLivroId());
        return ResponseEntity.ok(converterParaDTO(emprestimo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEmprestimo(@PathVariable Integer id) {
        // Implementar se necessário
        emprestimoService.buscarPorId(id); // Apenas verifica se existe
        return ResponseEntity.ok().build();
    }

    // ============================================================
    // MÉTODOS AUXILIARES
    // ============================================================

    private List<EmprestimoDTO> converterParaDTO(List<Emprestimo> emprestimos) {
        return emprestimos.stream().map(this::converterParaDTO).collect(Collectors.toList());
    }

    private EmprestimoDTO converterParaDTO(Emprestimo e) {
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
                livroDTO,
                e.getStatus()
        );
    }
}
