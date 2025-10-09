package com.projeto.biblioteca.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "livro")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_livro")
    private Integer id;

    @Column(nullable = false, length = 127)
    private String titulo;

    @Column(name = "ano_publicacao", nullable = false)
    private Short anoPublicacao;

    @Column(name = "qnt_total", nullable = false)
    private Short qntTotal = 1;

    @Column(name = "qnt_disponivel", nullable = false)
    private Short qntDisponivel = 1;

    @OneToMany(mappedBy = "livro", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Emprestimo> emprestimos = new ArrayList<>();

    public Livro() {}

    public Livro(String titulo, Short anoPublicacao, Short qntTotal) {
        this.titulo = titulo;
        this.anoPublicacao = anoPublicacao;
        this.qntTotal = qntTotal;
        this.qntDisponivel = qntTotal;
    }

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public Short getAnoPublicacao() { return anoPublicacao; }
    public void setAnoPublicacao(Short anoPublicacao) { this.anoPublicacao = anoPublicacao; }

    public Short getQntTotal() { return qntTotal; }
    public void setQntTotal(Short qntTotal) { this.qntTotal = qntTotal; }

    public Short getQntDisponivel() { return qntDisponivel; }
    public void setQntDisponivel(Short qntDisponivel) { this.qntDisponivel = qntDisponivel; }

    public List<Emprestimo> getEmprestimos() { return emprestimos; }

    // Métodos auxiliares
    public boolean disponivel() {
        return qntDisponivel > 0;
    }

    public void emprestar() {
        if (qntDisponivel > 0) qntDisponivel--;
    }

    public void devolver() {
        if (qntDisponivel < qntTotal) qntDisponivel++;
    }
}
