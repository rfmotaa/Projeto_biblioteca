package com.projeto.biblioteca.dto;

import java.time.LocalDateTime;

public class LivroInteresseDTO {
    private Integer id;
    private ClienteDTO cliente;
    private LivroDTO livro;
    private LocalDateTime dataCriacao;

    public LivroInteresseDTO(Integer id, ClienteDTO cliente, LivroDTO livro, LocalDateTime dataCriacao) {
        this.id = id;
        this.cliente = cliente;
        this.livro = livro;
        this.dataCriacao = dataCriacao;
    }

    public Integer getId() { return id; }
    public ClienteDTO getCliente() { return cliente; }
    public LivroDTO getLivro() { return livro; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }

    public void setCliente(ClienteDTO cliente) { this.cliente = cliente; }
    public void setLivro(LivroDTO livro) { this.livro = livro; }
}
