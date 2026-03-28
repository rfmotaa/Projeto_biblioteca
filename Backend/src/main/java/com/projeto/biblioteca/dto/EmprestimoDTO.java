package com.projeto.biblioteca.dto;

import com.projeto.biblioteca.model.Emprestimo;
import java.time.LocalDate;

public class EmprestimoDTO {
    private Integer id;
    private LocalDate dataRetirada;
    private LocalDate dataRetornoPrevisto;
    private LocalDate dataRetornoOficial;
    private ClienteDTO cliente;
    private LivroDTO livro;
    private Emprestimo.StatusEmprestimo status;
    private boolean estaAtrasado;
    private int numeroRenovacoes;

    public EmprestimoDTO(Integer id, LocalDate dataRetirada, LocalDate dataRetornoPrevisto, LocalDate dataRetornoOficial, ClienteDTO cliente, LivroDTO livro) {
        this.id = id;
        this.dataRetirada = dataRetirada;
        this.dataRetornoPrevisto = dataRetornoPrevisto;
        this.dataRetornoOficial = dataRetornoOficial;
        this.cliente = cliente;
        this.livro = livro;
        this.status = null;
        this.estaAtrasado = false;
        this.numeroRenovacoes = 0;
    }

    public EmprestimoDTO(Integer id, LocalDate dataRetirada, LocalDate dataRetornoPrevisto, LocalDate dataRetornoOficial, ClienteDTO cliente, LivroDTO livro, Emprestimo.StatusEmprestimo status) {
        this.id = id;
        this.dataRetirada = dataRetirada;
        this.dataRetornoPrevisto = dataRetornoPrevisto;
        this.dataRetornoOficial = dataRetornoOficial;
        this.cliente = cliente;
        this.livro = livro;
        this.status = status;
        this.estaAtrasado = false;
        this.numeroRenovacoes = 0;
    }

    public EmprestimoDTO(Integer id, LocalDate dataRetirada, LocalDate dataRetornoPrevisto, LocalDate dataRetornoOficial, ClienteDTO cliente, LivroDTO livro, Emprestimo.StatusEmprestimo status, boolean estaAtrasado) {
        this.id = id;
        this.dataRetirada = dataRetirada;
        this.dataRetornoPrevisto = dataRetornoPrevisto;
        this.dataRetornoOficial = dataRetornoOficial;
        this.cliente = cliente;
        this.livro = livro;
        this.status = status;
        this.estaAtrasado = estaAtrasado;
        this.numeroRenovacoes = 0;
    }

    public EmprestimoDTO(Integer id, LocalDate dataRetirada, LocalDate dataRetornoPrevisto, LocalDate dataRetornoOficial, ClienteDTO cliente, LivroDTO livro, Emprestimo.StatusEmprestimo status, boolean estaAtrasado, int numeroRenovacoes) {
        this.id = id;
        this.dataRetirada = dataRetirada;
        this.dataRetornoPrevisto = dataRetornoPrevisto;
        this.dataRetornoOficial = dataRetornoOficial;
        this.cliente = cliente;
        this.livro = livro;
        this.status = status;
        this.estaAtrasado = estaAtrasado;
        this.numeroRenovacoes = numeroRenovacoes;
    }

    public Integer getId() { return id; }
    public LocalDate getDataRetirada() { return dataRetirada; }
    public LocalDate getDataRetornoPrevisto() { return dataRetornoPrevisto; }
    public LocalDate getDataRetornoOficial() { return dataRetornoOficial; }
    public ClienteDTO getCliente() { return cliente; }
    public LivroDTO getLivro() { return livro; }
    public Emprestimo.StatusEmprestimo getStatus() { return status; }
    public boolean isEstaAtrasado() { return estaAtrasado; }
    public boolean getEstaAtrasado() { return estaAtrasado; }
    public int getNumeroRenovacoes() { return numeroRenovacoes; }

    @Override
    public String toString() {
        return "EmprestimoDTO{id=" + id + "}";
    }
}
