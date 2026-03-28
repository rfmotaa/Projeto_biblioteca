package com.projeto.biblioteca.dto;

public class LivroInteresseRequestDTO {
    private Integer livroId;

    public LivroInteresseRequestDTO() {}

    public LivroInteresseRequestDTO(Integer livroId) {
        this.livroId = livroId;
    }

    public Integer getLivroId() { return livroId; }
    public void setLivroId(Integer livroId) { this.livroId = livroId; }
}
