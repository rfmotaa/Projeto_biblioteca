package com.projeto.biblioteca.controller;

import com.projeto.biblioteca.dto.*;
import com.projeto.biblioteca.service.DashboardAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardAnalyticsController {

    @Autowired
    private DashboardAnalyticsService dashboardAnalyticsService;

    // ============================================================
    // ENDPOINT CONSOLIDADO - Retorna todos os dados de uma vez
    // ============================================================

    /**
     * GET /api/dashboard/analytics
     * Retorna todos os dados consolidados do dashboard de analytics.
     * Inclui empréstimos por semana, status dos empréstimos,
     * livros mais emprestados e percentual de livros disponíveis.
     *
     * @param ultimasSemanas número de semanas a considerar (opcional, padrão: 12)
     * @param topLivros número de top livros a retornar (opcional, padrão: 10)
     * @return DashboardStatsDTO com todas as métricas
     */
    @GetMapping("/analytics")
    public ResponseEntity<DashboardStatsDTO> getDashboardAnalytics(
            @RequestParam(required = false) Integer ultimasSemanas,
            @RequestParam(required = false) Integer topLivros) {

        // Validação de parâmetros
        if (ultimasSemanas != null && ultimasSemanas <= 0) {
            throw new IllegalArgumentException("ultimasSemanas deve ser maior que zero");
        }
        if (topLivros != null && topLivros <= 0) {
            throw new IllegalArgumentException("topLivros deve ser maior que zero");
        }

        DashboardStatsDTO stats = dashboardAnalyticsService.getDashboardAnalytics(ultimasSemanas, topLivros);
        return ResponseEntity.ok(stats);
    }

    // ============================================================
    // ENDPOINTS INDIVIDUAIS - Retorna cada métrica separadamente
    // ============================================================

    /**
     * GET /api/dashboard/emprestimos-por-semana
     * Retorna a contagem de empréstimos agrupados por semana e ano.
     *
     * @param ultimasSemanas número de semanas a considerar (opcional, padrão: 12)
     * @return Lista de empréstimos por semana
     */
    @GetMapping("/emprestimos-por-semana")
    public ResponseEntity<List<EmprestimosPorSemanaDTO>> getEmprestimosPorSemana(
            @RequestParam(required = false) Integer ultimasSemanas) {

        if (ultimasSemanas != null && ultimasSemanas <= 0) {
            throw new IllegalArgumentException("ultimasSemanas deve ser maior que zero");
        }

        List<EmprestimosPorSemanaDTO> emprestimos = dashboardAnalyticsService.getEmprestimosPorSemana(ultimasSemanas);
        return ResponseEntity.ok(emprestimos);
    }

    /**
     * GET /api/dashboard/emprestimos-status
     * Retorna a contagem de empréstimos por status (solicitados, negados, aprovados).
     *
     * @return EmprestimosStatusDTO com as contagens
     */
    @GetMapping("/emprestimos-status")
    public ResponseEntity<EmprestimosStatusDTO> getEmprestimosPorStatus() {
        EmprestimosStatusDTO status = dashboardAnalyticsService.getEmprestimosPorStatus();
        return ResponseEntity.ok(status);
    }

    /**
     * GET /api/dashboard/livros-mais-emprestados
     * Retorna o ranking dos livros mais emprestados na biblioteca.
     * Apenas considera empréstimos com status APROVADO, ATIVO ou FINALIZADO.
     *
     * @param top número de livros a retornar (opcional, padrão: 10)
     * @return Lista dos livros mais emprestados
     */
    @GetMapping("/livros-mais-emprestados")
    public ResponseEntity<List<LivroMaisEmprestadoDTO>> getLivrosMaisEmprestados(
            @RequestParam(required = false) Integer top) {

        if (top != null && top <= 0) {
            throw new IllegalArgumentException("top deve ser maior que zero");
        }

        List<LivroMaisEmprestadoDTO> livros = dashboardAnalyticsService.getLivrosMaisEmprestados(top);
        return ResponseEntity.ok(livros);
    }

    /**
     * GET /api/dashboard/percentual-livros
     * Retorna o percentual de livros disponíveis em relação ao total de livros.
     *
     * @return PercentualLivrosDTO com totais e percentual calculado
     */
    @GetMapping("/percentual-livros")
    public ResponseEntity<PercentualLivrosDTO> getPercentualLivros() {
        PercentualLivrosDTO percentual = dashboardAnalyticsService.getPercentualLivrosDisponiveis();
        return ResponseEntity.ok(percentual);
    }
}
