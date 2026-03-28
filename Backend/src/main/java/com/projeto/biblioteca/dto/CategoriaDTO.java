package com.projeto.biblioteca.dto;

public class CategoriaDTO {
    private Integer id;
    private String nome;

    public CategoriaDTO(Integer id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public Integer getId() { return id; }
    public String getNome() { return nome; }

    @Override
    public String toString() {
        return "CategoriaDTO{id=" + id + ", nome='" + nome + "'}";
    }
}
