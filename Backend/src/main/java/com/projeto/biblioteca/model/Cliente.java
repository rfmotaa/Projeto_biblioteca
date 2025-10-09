package com.projeto.biblioteca.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cliente")
public class Cliente {

    public static enum StatusCliente {
        ATIVO,
        BLOQUEADO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;

    @Enumerated(EnumType.STRING)
    private StatusCliente status;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Emprestimo> emprestimos = new ArrayList<>();

    public Cliente() {
    }

    public Cliente(String nome, String email, String senha, StatusCliente status) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.status = status;
    }

    // Getters e Setters
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public String getNome() {return nome;}
    public void setNome(String nome) {this.nome = nome;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public StatusCliente getStatus() { return status; }
    public void setStatus(StatusCliente status) { this.status = status; }

    public List<Emprestimo> getEmprestimos() {return emprestimos;}

    // Métodos
    public void ativar() {this.status = StatusCliente.ATIVO;}
    public void bloquear() {this.status = StatusCliente.BLOQUEADO;}

    public void realizarEmprestimo(Livro livro, LocalDate dataRetirada) {
        Emprestimo emprestimo = new Emprestimo(this, livro, dataRetirada);
        livro.emprestar(emprestimo);
        emprestimos.add(emprestimo);
    }

    public void devolverEmprestimo(Emprestimo emprestimo) {
        emprestimo.getLivro().devolver();
    }

    public boolean verificarSenha(String tentativa) {
        return senha != null && senha.equals(tentativa);
    }
}