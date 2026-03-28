package com.projeto.biblioteca.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificacao")
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacao")
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente", nullable = false)
    @JsonBackReference
    private Cliente cliente;

    @Column(name = "mensagem", nullable = false, length = 500)
    private String mensagem;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_notificacao", nullable = false, length = 50)
    private TipoNotificacao tipoNotificacao;

    @Column(name = "lida", nullable = false)
    private boolean lida = false;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_livro")
    private Livro livro;

    public enum TipoNotificacao {
        VENCIMENTO_PROXIMO,
        LIVRO_DISPONIVEL
    }

    public Notificacao() {}

    public Notificacao(Cliente cliente, String mensagem, TipoNotificacao tipoNotificacao, Livro livro) {
        this.cliente = cliente;
        this.mensagem = mensagem;
        this.tipoNotificacao = tipoNotificacao;
        this.livro = livro;
        this.dataCriacao = LocalDateTime.now();
        this.lida = false;
    }

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }

    public TipoNotificacao getTipoNotificacao() { return tipoNotificacao; }
    public void setTipoNotificacao(TipoNotificacao tipoNotificacao) { this.tipoNotificacao = tipoNotificacao; }

    public boolean isLida() { return lida; }
    public boolean getLida() { return lida; }
    public void setLida(boolean lida) { this.lida = lida; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public Livro getLivro() { return livro; }
    public void setLivro(Livro livro) { this.livro = livro; }

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        lida = false;
    }
}
