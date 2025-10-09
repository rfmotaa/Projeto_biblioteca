package com.projeto.biblioteca.model;

import jakarta.persistence.*;

@Entity
@Table(name = "funcionario")
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_funcionario")
    private Integer id;

    @Column(nullable = false, length = 127)
    private String nome;

    @Column(nullable = false, length = 45, unique = true)
    private String login;

    @Column(name = "senha_hash", nullable = false, length = 127)
    private String senhaHash;

    public Funcionario() {}

    public Funcionario(String nome, String login, String senhaHash) {
        this.nome = nome;
        this.login = login;
        this.senhaHash = senhaHash;
    }

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }

    // Métodos
    public boolean verificarSenha(String tentativa) {
        return senhaHash != null && senhaHash.equals(tentativa);
    }

    @Override
    public String toString() {
        return "Funcionario{id=" + id + ", nome='" + nome + "', login='" + login + "'}";
    }
}
