package com.projeto.biblioteca.dto;

public class EmprestimoRequestDTO {
    private Integer clienteId;
    private Integer livroId;

    public EmprestimoRequestDTO() {
    }

    public EmprestimoRequestDTO(Integer clienteId, Integer livroId) {
        this.clienteId = clienteId;
        this.livroId = livroId;
    }

    public Integer getClienteId() {
        return clienteId;
    }

    public void setClienteId(Integer clienteId) {
        this.clienteId = clienteId;
    }

    public Integer getLivroId() {
        return livroId;
    }

    public void setLivroId(Integer livroId) {
        this.livroId = livroId;
    }
}
