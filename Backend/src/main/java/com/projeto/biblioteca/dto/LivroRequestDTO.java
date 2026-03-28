package com.projeto.biblioteca.dto;

import java.util.List;

public class LivroRequestDTO {
    private String titulo;
    private String isbn;
    private String editora;
    private Integer edicao;
    private String autor;
    private Short anoPublicacao;
    private Short qntTotal;
    private List<Integer> categoriaIds;

    // Constructors
    public LivroRequestDTO() {}

    public LivroRequestDTO(String titulo, String isbn, String editora, Integer edicao,
                           String autor, Short anoPublicacao, Short qntTotal, List<Integer> categoriaIds) {
        this.titulo = titulo;
        this.isbn = isbn;
        this.editora = editora;
        this.edicao = edicao;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
        this.qntTotal = qntTotal;
        this.categoriaIds = categoriaIds;
    }

    // Getters and Setters
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getEditora() {
        return editora;
    }

    public void setEditora(String editora) {
        this.editora = editora;
    }

    public Integer getEdicao() {
        return edicao;
    }

    public void setEdicao(Integer edicao) {
        this.edicao = edicao;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public Short getAnoPublicacao() {
        return anoPublicacao;
    }

    public void setAnoPublicacao(Short anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }

    public Short getQntTotal() {
        return qntTotal;
    }

    public void setQntTotal(Short qntTotal) {
        this.qntTotal = qntTotal;
    }

    public List<Integer> getCategoriaIds() {
        return categoriaIds;
    }

    public void setCategoriaIds(List<Integer> categoriaIds) {
        this.categoriaIds = categoriaIds;
    }
}
