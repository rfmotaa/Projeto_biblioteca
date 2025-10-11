package com.projeto.biblioteca.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cliente")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
public class Cliente {

    public enum StatusCliente {
        ativo,
        bloqueado
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer id;

    @Column(nullable = false, length = 127)
    private String nome;

    @Column(nullable = false, length = 127, unique = true)
    private String email;

    @Column(name = "senha_hash", nullable = false, length = 45)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusCliente status;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Emprestimo> emprestimos = new ArrayList<>();

    public Cliente() {}

    public Cliente(String nome, String email, String senhaHash, StatusCliente status) {
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.status = status;
    }

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }

    public StatusCliente getStatus() { return status; }
    public void setStatus(StatusCliente status) { this.status = status; }

    public List<Emprestimo> getEmprestimos() { return emprestimos; }

    // Métodos auxiliares
    public void ativar() { this.status = StatusCliente.ativo; }
    public void bloquear() { this.status = StatusCliente.bloqueado; }

    public void realizarEmprestimo(Livro livro, LocalDate dataRetirada) {
        Emprestimo emprestimo = new Emprestimo(this, livro, dataRetirada);
        livro.emprestar();
        emprestimos.add(emprestimo);
    }

    public void devolverEmprestimo(Emprestimo emprestimo) {
        emprestimo.getLivro().devolver();
    }

    public boolean verificarSenha(String tentativa) {
        return senhaHash != null && senhaHash.equals(tentativa);
    }
}