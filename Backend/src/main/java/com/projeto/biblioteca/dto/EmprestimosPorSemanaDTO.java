package com.projeto.biblioteca.dto;

public class EmprestimosPorSemanaDTO {
    private Integer semana;
    private Integer ano;
    private Long quantidade;

    public EmprestimosPorSemanaDTO(Integer semana, Integer ano, Long quantidade) {
        this.semana = semana;
        this.ano = ano;
        this.quantidade = quantidade;
    }

    public Integer getSemana() {
        return semana;
    }

    public Integer getAno() {
        return ano;
    }

    public Long getQuantidade() {
        return quantidade;
    }

    @Override
    public String toString() {
        return "EmprestimosPorSemanaDTO{semana=" + semana + ", ano=" + ano + ", quantidade=" + quantidade + "}";
    }
}
