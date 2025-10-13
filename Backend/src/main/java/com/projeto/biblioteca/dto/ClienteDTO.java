package com.projeto.biblioteca.dto;

import com.projeto.biblioteca.model.Cliente;

import java.util.List;

public class ClienteDTO {
    private Integer id;
    private String nome;
    private String email;
    private Cliente.StatusCliente status;
    private List<Integer> emprestimosIds;

    public ClienteDTO(Integer id, String nome, String email, Cliente.StatusCliente status, List<Integer> emprestimosIds) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.status = status;
        this.emprestimosIds = emprestimosIds;
    }

    public Integer getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public Cliente.StatusCliente getStatus() { return status; }
    public List<Integer> getEmprestimosIds() { return emprestimosIds; }

    @Override
    public String toString() {
        return "ClienteDTO{id=" + id + ", nome='" + nome + "', email='" + email + "', status=" + status + ", emprestimosIds=" + emprestimosIds + "}";
    }
}
