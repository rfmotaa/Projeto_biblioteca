package com.projeto.biblioteca.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "emprestimo")
@JsonIdentityInfo(  
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_emprestimo")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_livro", nullable = false)
    private Livro livro;

    @Column(name = "data_retirada", nullable = false)
    private LocalDate dataRetirada;

    @Column(name = "data_retorno_previsto", nullable = false)
    private LocalDate dataRetornoPrevisto;

    @Column(name = "data_retorno_oficial")
    private LocalDate dataRetornoOficial;

    public Emprestimo() {}

    public Emprestimo(Cliente cliente, Livro livro, LocalDate dataRetirada) {
        this.cliente = cliente;
        this.livro = livro;
        this.dataRetirada = dataRetirada;
        this.dataRetornoPrevisto = dataRetirada.plusDays(7); // por exemplo 7 dias padrão
        livro.emprestar();
    }

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public Livro getLivro() { return livro; }
    public void setLivro(Livro livro) { this.livro = livro; }

    public LocalDate getDataRetirada() { return dataRetirada; }
    public void setDataRetirada(LocalDate dataRetirada) { this.dataRetirada = dataRetirada; }

    public LocalDate getDataRetornoPrevisto() { return dataRetornoPrevisto; }
    public void setDataRetornoPrevisto(LocalDate dataRetornoPrevisto) { this.dataRetornoPrevisto = dataRetornoPrevisto; }

    public LocalDate getDataRetornoOficial() { return dataRetornoOficial; }
    public void setDataRetornoOficial(LocalDate dataRetornoOficial) { this.dataRetornoOficial = dataRetornoOficial; }

    public void renovacao() {
        if (this.dataRetornoPrevisto != null) {
            this.dataRetornoPrevisto = this.dataRetornoPrevisto.plusDays(7);
        }
    }
}
