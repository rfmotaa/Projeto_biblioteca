package com.projeto.biblioteca.dto;

import java.util.List;

public class LivroDTO {
    private Integer id;
    private String titulo;
    private Short anoPublicacao;
    private Short qntTotal;
    private Short qntDisponivel;
    private List<Integer> emprestimosIds;

    public LivroDTO(Integer id, String titulo, Short anoPublicacao, Short qntTotal, Short qntDisponivel, List<Integer> emprestimosIds) {
        this.id = id;
        this.titulo = titulo;
        this.anoPublicacao = anoPublicacao;
        this.qntTotal = qntTotal;
        this.qntDisponivel = qntDisponivel;
        this.emprestimosIds = emprestimosIds;
    }

    public Integer getId() { return id; }
    public String getTitulo() { return titulo; }
    public Short getAnoPublicacao() { return anoPublicacao; }
    public Short getQntTotal() { return qntTotal; }
    public Short getQntDisponivel() { return qntDisponivel; }
    public List<Integer> getEmprestimosIds() { return emprestimosIds; }

    @Override
    public String toString() {
        return "LivroDTO{id=" + id + ", titulo='" + titulo + "'}";
    }
}
