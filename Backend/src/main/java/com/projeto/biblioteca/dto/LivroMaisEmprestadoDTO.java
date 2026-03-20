package com.projeto.biblioteca.dto;

public class LivroMaisEmprestadoDTO {
    private Integer id;
    private String titulo;
    private Long qtdEmprestimos;

    public LivroMaisEmprestadoDTO(Integer id, String titulo, Long qtdEmprestimos) {
        this.id = id;
        this.titulo = titulo;
        this.qtdEmprestimos = qtdEmprestimos;
    }

    public Integer getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public Long getQtdEmprestimos() {
        return qtdEmprestimos;
    }

    @Override
    public String toString() {
        return "LivroMaisEmprestadoDTO{id=" + id + ", titulo='" + titulo + "', qtdEmprestimos=" + qtdEmprestimos + "}";
    }
}
