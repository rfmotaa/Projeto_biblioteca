package com.projeto.biblioteca.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "emprestimo")
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_livro")
    private Livro livro;

    private LocalDate dataRetirada;
    private LocalDate dataRetornoPrevisto;
    private LocalDate dataRetornoOficial;

    public Emprestimo() {
    }

    public Emprestimo(Cliente cliente, Livro livro, LocalDate dataRetirada) {
        this.cliente = cliente;
        this.livro = livro;
        this.dataRetirada = dataRetirada;
        this.dataRetornoPrevisto = dataRetirada.plusDays(7);
    }

    // Getters e Setters
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public Livro getLivro() {return livro;}
    public void setLivro(Livro livro) {this.livro = livro;}

    public Cliente getCliente() {return cliente;}
    public void setCliente(Cliente cliente) {this.cliente = cliente;}

    public LocalDate getDataRetirada() {return dataRetirada;}
    public void setDataRetirada(LocalDate dataRetirada) {this.dataRetirada = dataRetirada;}

    public LocalDate getDataRetornoPrevisto() {return dataRetornoPrevisto;}
    public void setDataRetornoPrevisto(LocalDate dataRetornoPrevisto) {this.dataRetornoPrevisto = dataRetornoPrevisto;}

    public LocalDate getDataRetornoOficial() {return dataRetornoOficial;}
    public void setDataRetornoOficial(LocalDate dataRetornoOficial) {this.dataRetornoOficial = dataRetornoOficial;}

    public void renovacao() {
        if (this.dataRetornoPrevisto != null) {
            this.dataRetornoPrevisto = this.dataRetornoPrevisto.plusDays(7);
        }
    }
}

