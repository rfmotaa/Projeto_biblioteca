package com.projeto.biblioteca.dto;

public class EmprestimosStatusDTO {
    private Long solicitados;
    private Long negados;
    private Long aprovados;
    private Long atrasados;

    public EmprestimosStatusDTO(Long solicitados, Long negados, Long aprovados, Long atrasados) {
        this.solicitados = solicitados;
        this.negados = negados;
        this.aprovados = aprovados;
        this.atrasados = atrasados;
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

    public Long getAtrasados() {
        return atrasados;
    }

    @Override
    public String toString() {
        return "EmprestimosStatusDTO{solicitados=" + solicitados + ", negados=" + negados + ", aprovados=" + aprovados + ", atrasados=" + atrasados + "}";
    }
}
