package com.projeto.biblioteca.dto;

import java.util.List;

public class LivroDTO {
    private Integer id;
    private String titulo;
    private String isbn;
    private String editora;
    private Integer edicao;
    private String autor;
    private Short anoPublicacao;
    private Short qntTotal;
    private Short qntDisponivel;
    private List<Integer> emprestimosIds;
    private List<CategoriaDTO> categorias;

    public LivroDTO(Integer id, String titulo, String isbn, String editora, Integer edicao,
                     String autor, Short anoPublicacao, Short qntTotal, Short qntDisponivel,
                     List<Integer> emprestimosIds, List<CategoriaDTO> categorias) {
        this.id = id;
        this.titulo = titulo;
        this.isbn = isbn;
        this.editora = editora;
        this.edicao = edicao;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
        this.qntTotal = qntTotal;
        this.qntDisponivel = qntDisponivel;
        this.emprestimosIds = emprestimosIds;
        this.categorias = categorias;
    }

    public Integer getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getIsbn() { return isbn; }
    public String getEditora() { return editora; }
    public Integer getEdicao() { return edicao; }
    public String getAutor() { return autor; }
    public Short getAnoPublicacao() { return anoPublicacao; }
    public Short getQntTotal() { return qntTotal; }
    public Short getQntDisponivel() { return qntDisponivel; }
    public List<Integer> getEmprestimosIds() { return emprestimosIds; }
    public List<CategoriaDTO> getCategorias() { return categorias; }

    @Override
    public String toString() {
        return "LivroDTO{id=" + id + ", titulo='" + titulo + "'}";
    }
}
