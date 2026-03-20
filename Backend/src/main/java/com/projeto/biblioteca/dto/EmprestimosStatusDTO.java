package com.projeto.biblioteca.dto;

public class EmprestimosStatusDTO {
    private Long solicitados;
    private Long negados;
    private Long aprovados;

    public EmprestimosStatusDTO(Long solicitados, Long negados, Long aprovados) {
        this.solicitados = solicitados;
        this.negados = negados;
        this.aprovados = aprovados;
    }

    public Long getSolicitados() {
        return solicitados;
    }

    public Long getNegados() {
        return negados;
    }

    public Long getAprovados() {
        return aprovados;
    }

    @Override
    public String toString() {
        return "EmprestimosStatusDTO{solicitados=" + solicitados + ", negados=" + negados + ", aprovados=" + aprovados + "}";
    }
}
