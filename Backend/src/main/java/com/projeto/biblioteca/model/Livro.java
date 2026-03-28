package com.projeto.biblioteca.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "livro")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_livro")
    private Integer id;

    @Column(nullable = false, length = 127)
    private String titulo;

    @Column(length = 20, unique = true)
    private String isbn;

    @Column(length = 100)
    private String editora;

    @Column
    private Integer edicao = 1;

    @Column(nullable = false, length = 100)
    private String autor;

    @Column(name = "ano_publicacao", nullable = false)
    private Short anoPublicacao;

    @Column(name = "qnt_total", nullable = false)
    private Short qntTotal = 1;

    @Column(name = "qnt_disponivel", nullable = false)
    private Short qntDisponivel;

    @OneToMany(mappedBy = "livro", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Emprestimo> emprestimos = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "livro_categoria",
        joinColumns = @JoinColumn(name = "id_livro"),
        inverseJoinColumns = @JoinColumn(name = "id_categoria")
    )
    private Set<Categoria> categorias = new HashSet<>();

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

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getEditora() { return editora; }
    public void setEditora(String editora) { this.editora = editora; }

    public Integer getEdicao() { return edicao; }
    public void setEdicao(Integer edicao) { this.edicao = edicao; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public Short getAnoPublicacao() { return anoPublicacao; }
    public void setAnoPublicacao(Short anoPublicacao) { this.anoPublicacao = anoPublicacao; }

    public Short getQntTotal() { return qntTotal; }
    public void setQntTotal(Short qntTotal) { this.qntTotal = qntTotal; }

    public Short getQntDisponivel() { return qntDisponivel; }
    public void setQntDisponivel(Short qntDisponivel) { this.qntDisponivel = qntDisponivel; }

    public List<Emprestimo> getEmprestimos() { return emprestimos; }

    public Set<Categoria> getCategorias() { return categorias; }
    public void setCategorias(Set<Categoria> categorias) { this.categorias = categorias; }

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
