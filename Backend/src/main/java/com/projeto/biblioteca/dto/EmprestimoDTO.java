package com.projeto.biblioteca.dto;

import java.time.LocalDate;

public class EmprestimoDTO {
    private Integer id;
    private LocalDate dataRetirada;
    private LocalDate dataRetornoPrevisto;
    private LocalDate dataRetornoOficial;
    private ClienteDTO cliente;
    private LivroDTO livro;

    public EmprestimoDTO(Integer id, LocalDate dataRetirada, LocalDate dataRetornoPrevisto, LocalDate dataRetornoOficial, ClienteDTO cliente, LivroDTO livro) {
        this.id = id;
        this.dataRetirada = dataRetirada;
        this.dataRetornoPrevisto = dataRetornoPrevisto;
        this.dataRetornoOficial = dataRetornoOficial;
        this.cliente = cliente;
        this.livro = livro;
    }

    public Integer getId() { return id; }
    public LocalDate getDataRetirada() { return dataRetirada; }
    public LocalDate getDataRetornoPrevisto() { return dataRetornoPrevisto; }
    public LocalDate getDataRetornoOficial() { return dataRetornoOficial; }
    public ClienteDTO getCliente() { return cliente; }
    public LivroDTO getLivro() { return livro; }

    @Override
    public String toString() {
        return "EmprestimoDTO{id=" + id + "}";
    }
}
