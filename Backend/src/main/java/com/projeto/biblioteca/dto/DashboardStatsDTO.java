package com.projeto.biblioteca.dto;

import java.util.List;

public class DashboardStatsDTO {
    private List<EmprestimosPorSemanaDTO> emprestimosPorSemana;
    private EmprestimosStatusDTO emprestimosStatus;
    private List<LivroMaisEmprestadoDTO> livrosMaisEmprestados;
    private PercentualLivrosDTO percentualLivros;

    public DashboardStatsDTO(List<EmprestimosPorSemanaDTO> emprestimosPorSemana,
                             EmprestimosStatusDTO emprestimosStatus,
                             List<LivroMaisEmprestadoDTO> livrosMaisEmprestados,
                             PercentualLivrosDTO percentualLivros) {
        this.emprestimosPorSemana = emprestimosPorSemana;
        this.emprestimosStatus = emprestimosStatus;
        this.livrosMaisEmprestados = livrosMaisEmprestados;
        this.percentualLivros = percentualLivros;
    }

    public List<EmprestimosPorSemanaDTO> getEmprestimosPorSemana() {
        return emprestimosPorSemana;
    }

    public EmprestimosStatusDTO getEmprestimosStatus() {
        return emprestimosStatus;
    }

    public List<LivroMaisEmprestadoDTO> getLivrosMaisEmprestados() {
        return livrosMaisEmprestados;
    }

    public PercentualLivrosDTO getPercentualLivros() {
        return percentualLivros;
    }

    @Override
    public String toString() {
        return "DashboardStatsDTO{" +
                "emprestimosPorSemana=" + emprestimosPorSemana +
                ", emprestimosStatus=" + emprestimosStatus +
                ", livrosMaisEmprestados=" + livrosMaisEmprestados +
                ", percentualLivros=" + percentualLivros +
                '}';
    }
}
