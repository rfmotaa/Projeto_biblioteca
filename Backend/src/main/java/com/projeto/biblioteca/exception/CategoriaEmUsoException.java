package com.projeto.biblioteca.exception;

public class CategoriaEmUsoException extends RuntimeException {
    public CategoriaEmUsoException(Integer id, int quantidadeLivros) {
        super(
            "Não é possível deletar categoria ID " + id + ". " +
            "Ela está associada a " + quantidadeLivros + " livro(s)."
        );
    }

    public CategoriaEmUsoException(String mensagem) {
        super(mensagem);
    }
}
