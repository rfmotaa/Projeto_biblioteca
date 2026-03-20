package com.projeto.biblioteca.dto;

public class PercentualLivrosDTO {
    private Long livrosTotais;
    private Long livrosDisponiveis;
    private Double percentual;

    public PercentualLivrosDTO(Long livrosTotais, Long livrosDisponiveis, Double percentual) {
        this.livrosTotais = livrosTotais;
        this.livrosDisponiveis = livrosDisponiveis;
        this.percentual = percentual;
    }

    public Long getLivrosTotais() {
        return livrosTotais;
    }

    public Long getLivrosDisponiveis() {
        return livrosDisponiveis;
    }

    public Double getPercentual() {
        return percentual;
    }

    @Override
    public String toString() {
        return "PercentualLivrosDTO{livrosTotais=" + livrosTotais + ", livrosDisponiveis=" + livrosDisponiveis + ", percentual=" + percentual + "}";
    }
}
