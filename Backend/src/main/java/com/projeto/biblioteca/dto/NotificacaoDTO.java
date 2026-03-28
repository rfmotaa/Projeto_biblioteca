package com.projeto.biblioteca.dto;

import com.projeto.biblioteca.model.Notificacao;
import java.time.LocalDateTime;

public class NotificacaoDTO {
    private Integer id;
    private String mensagem;
    private Notificacao.TipoNotificacao tipoNotificacao;
    private boolean lida;
    private LocalDateTime dataCriacao;
    private LivroDTO livro;

    public NotificacaoDTO(Integer id, String mensagem, Notificacao.TipoNotificacao tipoNotificacao,
                          boolean lida, LocalDateTime dataCriacao, LivroDTO livro) {
        this.id = id;
        this.mensagem = mensagem;
        this.tipoNotificacao = tipoNotificacao;
        this.lida = lida;
        this.dataCriacao = dataCriacao;
        this.livro = livro;
    }

    public Integer getId() { return id; }
    public String getMensagem() { return mensagem; }
    public Notificacao.TipoNotificacao getTipoNotificacao() { return tipoNotificacao; }
    public boolean isLida() { return lida; }
    public boolean getLida() { return lida; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public LivroDTO getLivro() { return livro; }
}
