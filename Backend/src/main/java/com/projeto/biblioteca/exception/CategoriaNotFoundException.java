package com.projeto.biblioteca.exception;

public class CategoriaNotFoundException extends RuntimeException {
    public CategoriaNotFoundException(Integer id) {
        super("Categoria com ID " + id + " não encontrada");
    }

    public CategoriaNotFoundException(String mensagem) {
        super(mensagem);
    }
}
