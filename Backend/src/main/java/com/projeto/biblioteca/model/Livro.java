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
    private int ano_publicacao;
    private int qnt_total;
    private int qnt_disponivel;

    @OneToMany(mappedBy = "livro", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Emprestimo> emprestimos = new ArrayList<>();

    public Livro() {}

    public Livro(String titulo, int ano_publicacao, int qnt_total, int qnt_disponivel) {
        this.titulo = titulo;
        this.ano_publicacao = ano_publicacao;
        this.qnt_total = qnt_total;
        this.qnt_disponivel = qnt_disponivel;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public int getAnoPublicacao() { return ano_publicacao; }
    public void setAnoPublicacao(int ano_publicacao) { this.ano_publicacao = ano_publicacao; }

    public int getQntTotal() { return qnt_total; }
    public void setQntTotal(int qnt_total) { this.qnt_total = qnt_total; }

    public int getQntDisponivel() { return qnt_disponivel; }
    public void setQntDisponivel(int qnt_disponivel) { this.qnt_disponivel = qnt_disponivel; }

    public List<Emprestimo> getEmprestimos() { return emprestimos; }

    // Métodos
    public void emprestar(Emprestimo emprestimo) {
        if (disponivel()) {
            emprestimos.add(emprestimo);
            qnt_disponivel--;
        } else {
            throw new IllegalStateException();
        }
    }

    public void devolver() {
        if (qnt_disponivel >= qnt_total) {
            throw new IllegalStateException();
        }
        qnt_disponivel++;
    }

    public boolean disponivel() {
        return qnt_disponivel > 0;
    }
}