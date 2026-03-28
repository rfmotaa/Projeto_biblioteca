package com.projeto.biblioteca.service;

import com.projeto.biblioteca.dto.LivroDTO;
import com.projeto.biblioteca.dto.NotificacaoDTO;
import com.projeto.biblioteca.model.Cliente;
import com.projeto.biblioteca.model.Emprestimo;
import com.projeto.biblioteca.model.Livro;
import com.projeto.biblioteca.model.Notificacao;
import com.projeto.biblioteca.repository.ClienteRepository;
import com.projeto.biblioteca.repository.LivroRepository;
import com.projeto.biblioteca.repository.NotificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private LivroRepository livroRepository;

    private static final int DIAS_AVISO_VENCIMENTO = 3;

    /**
     * Cria uma notificação de vencimento próximo
     */
    @Transactional
    public Notificacao criarNotificacaoVencimento(Integer clienteId, Emprestimo emprestimo) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        LocalDate dataVencimento = emprestimo.getDataRetornoPrevisto();
        LocalDate hoje = LocalDate.now();
        long diasRestantes = java.time.temporal.ChronoUnit.DAYS.between(hoje, dataVencimento);

        String mensagem = String.format("Seu empréstimo do livro '%s' vence em %d dias. Por favor, renove ou devolva o livro.",
                emprestimo.getLivro().getTitulo(), diasRestantes);

        Notificacao notificacao = new Notificacao(
                cliente,
                mensagem,
                Notificacao.TipoNotificacao.VENCIMENTO_PROXIMO,
                emprestimo.getLivro()
        );

        return notificacaoRepository.save(notificacao);
    }

    /**
     * Cria uma notificação de livro disponível
     */
    @Transactional
    public Notificacao criarNotificacaoLivroDisponivel(Integer clienteId, Integer livroId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Livro livro = livroRepository.findById(livroId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        String mensagem = String.format("O livro '%s' que você marcou com interesse está disponível para empréstimo!",
                livro.getTitulo());

        Notificacao notificacao = new Notificacao(
                cliente,
                mensagem,
                Notificacao.TipoNotificacao.LIVRO_DISPONIVEL,
                livro
        );

        return notificacaoRepository.save(notificacao);
    }

    /**
     * Busca notificações não lidas de um cliente
     */
    public List<NotificacaoDTO> buscarNotificacoesNaoLidas(Integer clienteId) {
        List<Notificacao> notificacoes = notificacaoRepository.findByClienteIdAndLidaFalseOrderByDataCriacaoDesc(clienteId);
        return notificacoes.stream()
                .limit(20)
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    /**
     * Conta notificações não lidas
     */
    public long contarNaoLidas(Integer clienteId) {
        return notificacaoRepository.countByClienteIdAndLidaFalse(clienteId);
    }

    /**
     * Marca uma notificação como lida
     */
    @Transactional
    public void marcarComoLida(Integer notificacaoId) {
        Notificacao notificacao = notificacaoRepository.findById(notificacaoId)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));
        notificacao.setLida(true);
        notificacaoRepository.save(notificacao);
    }

    /**
     * Marca todas as notificações de um cliente como lidas
     */
    @Transactional
    public void marcarTodasComoLidas(Integer clienteId) {
        List<Notificacao> notificacoes = notificacaoRepository.findByClienteIdAndLidaFalseOrderByDataCriacaoDesc(clienteId);
        notificacoes.forEach(n -> n.setLida(true));
        notificacaoRepository.saveAll(notificacoes);
    }

    /**
     * Verifica e cria notificações para vencimentos próximos
     */
    @Transactional
    public void verificarVencimentosProximos() {
        // Esta seria implementada por um scheduler
        // Por enquanto, pode ser chamada manualmente para testes
    }

    private NotificacaoDTO converterParaDTO(Notificacao notificacao) {
        LivroDTO livroDTO = null;
        if (notificacao.getLivro() != null) {
            livroDTO = new LivroDTO(
                    notificacao.getLivro().getId(),
                    notificacao.getLivro().getTitulo(),
                    notificacao.getLivro().getIsbn(),
                    notificacao.getLivro().getEditora(),
                    notificacao.getLivro().getEdicao(),
                    notificacao.getLivro().getAutor(),
                    notificacao.getLivro().getAnoPublicacao(),
                    notificacao.getLivro().getQntTotal(),
                    notificacao.getLivro().getQntDisponivel(),
                    null,
                    null
            );
        }

        return new NotificacaoDTO(
                notificacao.getId(),
                notificacao.getMensagem(),
                notificacao.getTipoNotificacao(),
                notificacao.isLida(),
                notificacao.getDataCriacao(),
                livroDTO
        );
    }
}
