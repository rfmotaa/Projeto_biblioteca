package com.projeto.biblioteca.service;

import com.projeto.biblioteca.dto.*;
import com.projeto.biblioteca.model.Emprestimo;
import com.projeto.biblioteca.repository.EmprestimoRepository;
import com.projeto.biblioteca.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardAnalyticsService {

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @Autowired
    private LivroRepository livroRepository;

    // Constantes padrão
    private static final int DEFAULT_ULTIMAS_SEMANAS = 12;
    private static final int DEFAULT_TOP_LIVROS = 10;

    /**
     * Busca empréstimos agrupados por semana
     * @param ultimasSemanas número de semanas a considerar (padrão: 12)
     * @return Lista de empréstimos por semana
     */
    public List<EmprestimosPorSemanaDTO> getEmprestimosPorSemana(Integer ultimasSemanas) {
        int semanas = ultimasSemanas != null && ultimasSemanas > 0 ? ultimasSemanas : DEFAULT_ULTIMAS_SEMANAS;

        List<Object[]> resultados = emprestimoRepository.countEmprestimosPorSemana(semanas);
        List<EmprestimosPorSemanaDTO> dtos = new ArrayList<>();

        for (Object[] row : resultados) {
            Integer semana = ((Number) row[0]).intValue();
            Integer ano = ((Number) row[1]).intValue();
            Long quantidade = ((Number) row[2]).longValue();

            dtos.add(new EmprestimosPorSemanaDTO(semana, ano, quantidade));
        }

        return dtos;
    }

    /**
     * Busca contagem de empréstimos por status
     * @return DTO com solicitados, negados e aprovados
     */
    public EmprestimosStatusDTO getEmprestimosPorStatus() {
        long solicitados = emprestimoRepository.countSolicitados();
        long negados = emprestimoRepository.countNegados();
        long aprovados = emprestimoRepository.countAprovados();

        return new EmprestimosStatusDTO(solicitados, negados, aprovados);
    }

    /**
     * Busca os livros mais emprestados
     * @param topN número de livros a retornar (padrão: 10)
     * @return Lista dos livros mais emprestados
     */
    public List<LivroMaisEmprestadoDTO> getLivrosMaisEmprestados(Integer topN) {
        int top = topN != null && topN > 0 ? topN : DEFAULT_TOP_LIVROS;

        List<Object[]> resultados = emprestimoRepository.findLivrosMaisEmprestados(top);
        List<LivroMaisEmprestadoDTO> dtos = new ArrayList<>();

        for (Object[] row : resultados) {
            Integer id = ((Number) row[0]).intValue();
            String titulo = (String) row[1];
            Long qtdEmprestimos = ((Number) row[2]).longValue();

            dtos.add(new LivroMaisEmprestadoDTO(id, titulo, qtdEmprestimos));
        }

        return dtos;
    }

    /**
     * Calcula o percentual de livros disponíveis em relação ao total
     * @return DTO com totais e percentual calculado
     */
    public PercentualLivrosDTO getPercentualLivrosDisponiveis() {
        Long livrosTotais = livroRepository.countTotalLivros();
        Long livrosDisponiveis = livroRepository.countTotalLivrosDisponiveis();

        // Proteção contra null
        if (livrosTotais == null) {
            livrosTotais = 0L;
        }
        if (livrosDisponiveis == null) {
            livrosDisponiveis = 0L;
        }

        // Cálculo do percentual
        Double percentual = 0.0;
        if (livrosTotais > 0) {
            percentual = (livrosDisponiveis.doubleValue() / livrosTotais.doubleValue()) * 100.0;
            // Arredondar para 2 casas decimais
            percentual = Math.round(percentual * 100.0) / 100.0;
        }

        return new PercentualLivrosDTO(livrosTotais, livrosDisponiveis, percentual);
    }

    /**
     * Retorna todos os dados consolidados do dashboard de analytics
     * @return DTO com todas as métricas do dashboard
     */
    public DashboardStatsDTO getDashboardAnalytics(Integer ultimasSemanas, Integer topLivros) {
        List<EmprestimosPorSemanaDTO> emprestimosPorSemana = getEmprestimosPorSemana(ultimasSemanas);
        EmprestimosStatusDTO emprestimosStatus = getEmprestimosPorStatus();
        List<LivroMaisEmprestadoDTO> livrosMaisEmprestados = getLivrosMaisEmprestados(topLivros);
        PercentualLivrosDTO percentualLivros = getPercentualLivrosDisponiveis();

        return new DashboardStatsDTO(
                emprestimosPorSemana,
                emprestimosStatus,
                livrosMaisEmprestados,
                percentualLivros
        );
    }

    /**
     * Retorna todos os dados consolidados do dashboard de analytics (usando valores padrão)
     * @return DTO com todas as métricas do dashboard
     */
    public DashboardStatsDTO getDashboardAnalytics() {
        return getDashboardAnalytics(DEFAULT_ULTIMAS_SEMANAS, DEFAULT_TOP_LIVROS);
    }
}
