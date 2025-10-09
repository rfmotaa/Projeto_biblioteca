package com.projeto.biblioteca.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "livro")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(name = "ano_publicacao")
    private int anoPublicacao;

    @Column(name = "qnt_total")
    private int quantidadeTotal;

    @Column(name = "qnt_disponivel")
    private int quantidadeDisponivel;

    @OneToMany(mappedBy = "livro", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Emprestimo> emprestimos = new ArrayList<>();

    public Livro() {}

    public Livro(String titulo, int anoPublicacao, int quantidadeTotal, int quantidadeDisponivel) {
        this.titulo = titulo;
        this.anoPublicacao = anoPublicacao;
        this.quantidadeTotal = quantidadeTotal;
        this.quantidadeDisponivel = quantidadeDisponivel;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public int getAnoPublicacao() { return anoPublicacao; }
    public void setAnoPublicacao(int anoPublicacao) { this.anoPublicacao = anoPublicacao; }

    public int getQntTotal() { return quantidadeTotal; }
    public void setQntTotal(int quantidadeTotal) { this.quantidadeTotal = quantidadeTotal; }

    public int getQntDisponivel() { return quantidadeDisponivel; }
    public void setQntDisponivel(int quantidadeDisponivel) { this.quantidadeDisponivel = quantidadeDisponivel; }

    public List<Emprestimo> getEmprestimos() { return emprestimos; }

    // Métodos de negócio
    public void emprestar(Emprestimo emprestimo) {
        if (!disponivel()) {
            throw new IllegalStateException("Livro indisponível para empréstimo.");
        }
        emprestimos.add(emprestimo);
        quantidadeDisponivel--;
    }

    public void devolver() {
        if (quantidadeDisponivel >= quantidadeTotal) {
            throw new IllegalStateException("Não há livros emprestados para devolver.");
        }
        quantidadeDisponivel++;
    }

    public boolean disponivel() {
        return quantidadeDisponivel > 0;
    }
}