package com.projeto.biblioteca.scheduler;

import com.projeto.biblioteca.model.Emprestimo;
import com.projeto.biblioteca.model.Notificacao;
import com.projeto.biblioteca.repository.EmprestimoRepository;
import com.projeto.biblioteca.repository.NotificacaoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduler responsável por verificar e criar notificações para vencimentos próximos
 * Executa diariamente às 9:00 AM
 */
@Component
public class VencimentoScheduler {

    private static final Logger logger = LoggerFactory.getLogger(VencimentoScheduler.class);

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    /**
     * Número de dias antes do vencimento para enviar notificação
     */
    private static final int DIAS_AVISO_VENCIMENTO = 3;

    /**
     * Executa diariamente às 9:00 AM para verificar vencimentos próximos
     * Cron expression: segundo minuto hora dia mês dia-da-semana
     * 0 0 9 * * ? = Todos os dias às 9:00 AM
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void verificarVencimentosProximos() {
        logger.info("Iniciando verificação de vencimentos próximos às {}", LocalDateTime.now());

        try {
            LocalDate hoje = LocalDate.now();
            LocalDate dataLimite = hoje.plusDays(DIAS_AVISO_VENCIMENTO);

            // Buscar empréstimos ATIVOS que vencem nos próximos DIAS_AVISO_VENCIMENTO dias
            List<Emprestimo> emprestimosAVencer = emprestimoRepository.findActiveLoansExpiringSoon(
                hoje,
                dataLimite
            );

            logger.info("Encontrados {} empréstimos próximos do vencimento", emprestimosAVencer.size());

            int notificacoesCriadas = 0;
            int notificacoesPuladas = 0;

            for (Emprestimo emprestimo : emprestimosAVencer) {
                try {
                    // Verificar se já existe notificação para este empréstimo nas últimas 24 horas
                    boolean notificacaoRecente = notificacaoRepository.existsByClienteIdAndTipoNotificacaoAndLivroIdAndDataCriacaoAfter(
                        emprestimo.getCliente().getId(),
                        Notificacao.TipoNotificacao.VENCIMENTO_PROXIMO,
                        emprestimo.getLivro().getId(),
                        LocalDateTime.now().minusDays(1)
                    );

                    if (notificacaoRecente) {
                        logger.debug("Notificação já existe para o empréstimo {} do cliente {}, pulando",
                            emprestimo.getId(), emprestimo.getCliente().getId());
                        notificacoesPuladas++;
                        continue;
                    }

                    // Calcular dias restantes
                    long diasRestantes = java.time.temporal.ChronoUnit.DAYS.between(
                        hoje,
                        emprestimo.getDataRetornoPrevisto()
                    );

                    // Criar mensagem personalizada
                    String mensagem = String.format(
                        "Seu empréstimo do livro '%s' vence em %d dia%s. Por favor, renove ou devolva o livro.",
                        emprestimo.getLivro().getTitulo(),
                        diasRestantes,
                        diasRestantes == 1 ? "" : "s"
                    );

                    // Criar notificação
                    Notificacao notificacao = new Notificacao();
                    notificacao.setCliente(emprestimo.getCliente());
                    notificacao.setLivro(emprestimo.getLivro());
                    notificacao.setMensagem(mensagem);
                    notificacao.setTipoNotificacao(Notificacao.TipoNotificacao.VENCIMENTO_PROXIMO);
                    notificacao.setLida(false);
                    notificacao.setDataCriacao(LocalDateTime.now());

                    notificacaoRepository.save(notificacao);
                    notificacoesCriadas++;

                    logger.info("Notificação criada para o cliente {} sobre o empréstimo do livro '{}'",
                        emprestimo.getCliente().getId(), emprestimo.getLivro().getTitulo());

                } catch (Exception e) {
                    logger.error("Erro ao processar empréstimo {}: {}", emprestimo.getId(), e.getMessage());
                }
            }

            logger.info("Verificação de vencimentos concluída. Notificações criadas: {}, puladas: {}",
                notificacoesCriadas, notificacoesPuladas);

        } catch (Exception e) {
            logger.error("Erro ao executar verificação de vencimentos: {}", e.getMessage(), e);
        }
    }

    /**
     * Método executado a cada hora para verificação adicional (opcional)
     * Pode ser útil para testes ou para intervalos mais curtos
     */
    // @Scheduled(fixedRate = 3600000) // Executa a cada hora (em milissegundos)
    public void verificarVencimentosProximosHoraEmHora() {
        // Desabilitado por padrão - usar o método de execução diária
        logger.debug("Verificação horária de vencimentos (desabilitada)");
    }
}
