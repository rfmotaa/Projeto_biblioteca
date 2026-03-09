package com.projeto.biblioteca.service;

import com.projeto.biblioteca.model.Emprestimo;
import com.projeto.biblioteca.model.Cliente;
import com.projeto.biblioteca.model.Livro;
import com.projeto.biblioteca.repository.EmprestimoRepository;
import com.projeto.biblioteca.repository.ClienteRepository;
import com.projeto.biblioteca.repository.LivroRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmprestimoService {

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private LivroRepository livroRepository;

    // Constantes de regras de negócio
    private static final int MAX_EMPRESTIMOS_ATIVOS = 3;
    private static final int DIAS_EMPRESTIMO_SOLICITACAO = 7;
    private static final int DIAS_EMPRESTIMO_DIRETO = 14;
    private static final int DIAS_RENOVACAO = 7;
    private static final int MAX_RENOVACOES = 2;

    // ============================================================
    // MÉTODOS DE VALIDAÇÃO (reutilizáveis)
    // ============================================================

    /**
     * Valida se cliente pode realizar operações de empréstimo
     */
    private void validarCliente(Cliente cliente) {
        if (cliente.getStatus() == Cliente.StatusCliente.bloqueado) {
            throw new RuntimeException("Cliente está bloqueado e não pode realizar empréstimos.");
        }
    }

    /**
     * Valida se livro está disponível
     */
    private void validarDisponibilidadeLivro(Livro livro) {
        if (!livro.disponivel()) {
            throw new RuntimeException("Livro indisponível para empréstimo.");
        }
    }

    /**
     * Valida se cliente já tem empréstimo/solicitação para este livro
     */
    private void validarDuplicidade(Integer clienteId, Integer livroId) {
        long duplicata = emprestimoRepository.countByClienteIdAndLivroIdAndActiveOrPending(
            clienteId, livroId
        );
        if (duplicata > 0) {
            throw new RuntimeException("Cliente já possui uma solicitação ou empréstimo ativo para este livro.");
        }
    }

    /**
     * Valida se cliente não excedeu o limite de empréstimos ativos/pendentes
     */
    private void validarLimiteEmprestimos(Integer clienteId) {
        long total = emprestimoRepository.countActiveAndPendingByClienteId(clienteId);
        if (total >= MAX_EMPRESTIMOS_ATIVOS) {
            throw new RuntimeException(String.format(
                "Cliente já possui %d empréstimos ativos/pendentes. Máximo permitido: %d.",
                total, MAX_EMPRESTIMOS_ATIVOS
            ));
        }
    }

    /**
     * Validações completas para criar novo empréstimo/solicitação
     */
    private void validarNovoEmprestimo(Integer clienteId, Integer livroId) {
        validarDuplicidade(clienteId, livroId);
        validarLimiteEmprestimos(clienteId);
    }

    // ============================================================
    // OPERAÇÕES DE CLIENTE - Solicitar Empréstimo
    // ============================================================

    /**
     * CLIENTE: Cria uma solicitação de empréstimo (status PENDENTE)
     * - Verifica disponibilidade mas NÃO reserva o livro
     * - Livro só será reservado quando admin aprovar
     */
    @Transactional
    public Emprestimo criarSolicitacao(Integer clienteId, Integer livroId) {
        return criarSolicitacaoInternal(clienteId, livroId);
    }

    /**
     * @deprecated Use criarSolicitacao(Integer, Integer)
     */
    @Deprecated
    @Transactional
    public Emprestimo criarSolicitacao(Emprestimo e) {
        return criarSolicitacaoInternal(e.getCliente().getId(), e.getLivro().getId());
    }

    private Emprestimo criarSolicitacaoInternal(Integer clienteId, Integer livroId) {
        // Buscar entidades
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        Livro livro = livroRepository.findById(livroId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado."));

        // Validações
        validarCliente(cliente);
        validarDisponibilidadeLivro(livro);
        validarNovoEmprestimo(clienteId, livroId);

        // Criar solicitação PENDENTE
        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setCliente(cliente);
        emprestimo.setLivro(livro);
        emprestimo.setDataRetirada(LocalDate.now());
        emprestimo.setDataRetornoPrevisto(LocalDate.now().plusDays(DIAS_EMPRESTIMO_SOLICITACAO));
        emprestimo.setStatus(Emprestimo.StatusEmprestimo.PENDENTE);
        // NÃO reduz qntDisponivel - só reduz ao aprovar

        return emprestimoRepository.save(emprestimo);
    }

    // ============================================================
    // OPERAÇÕES DE ADMIN - Aprovar/Rejeitar Solicitações
    // ============================================================

    /**
     * ADMIN: Aprova uma solicitação pendente (PENDENTE → ATIVO)
     * - Reserva o livro (reduz qntDisponivel)
     * - Define data de devolução
     */
    @Transactional
    public Emprestimo aprovarSolicitacao(Integer id) {
        Emprestimo emprestimo = buscarPorId(id);

        if (emprestimo.getStatus() != Emprestimo.StatusEmprestimo.PENDENTE) {
            throw new RuntimeException("Apenas solicitações PENDENTES podem ser aprovadas.");
        }

        // Verificar disponibilidade novamente
        Livro livro = emprestimo.getLivro();
        if (!livro.disponivel()) {
            throw new RuntimeException("Livro não está mais disponível. Solicitação não pode ser aprovada.");
        }

        // Aprovar e reservar livro
        emprestimo.setStatus(Emprestimo.StatusEmprestimo.ATIVO);
        livro.emprestar();
        livroRepository.save(livro);

        return emprestimoRepository.save(emprestimo);
    }

    /**
     * ADMIN: Rejeita uma solicitação pendente (PENDENTE → REJEITADO)
     * - NÃO afeta qntDisponivel
     */
    @Transactional
    public Emprestimo rejeitarSolicitacao(Integer id) {
        Emprestimo emprestimo = buscarPorId(id);

        if (emprestimo.getStatus() != Emprestimo.StatusEmprestimo.PENDENTE) {
            throw new RuntimeException("Apenas solicitações PENDENTES podem ser rejeitadas.");
        }

        emprestimo.setStatus(Emprestimo.StatusEmprestimo.REJEITADO);
        return emprestimoRepository.save(emprestimo);
    }

    // ============================================================
    // OPERAÇÕES DE ADMIN - Criar Empréstimo Diretamente
    // ============================================================

    /**
     * ADMIN: Cria empréstimo diretamente (status ATIVO)
     * - Reserva o livro imediatamente (reduz qntDisponivel)
     * - Prazo maior que solicitação (14 dias vs 7 dias)
     */
    @Transactional
    public Emprestimo criarDireto(Integer clienteId, Integer livroId) {
        return criarDiretoInternal(clienteId, livroId);
    }

    /**
     * @deprecated Use criarDireto(Integer, Integer)
     */
    @Deprecated
    @Transactional
    public Emprestimo criarDireto(Emprestimo e) {
        return criarDiretoInternal(e.getCliente().getId(), e.getLivro().getId());
    }

    private Emprestimo criarDiretoInternal(Integer clienteId, Integer livroId) {
        // Buscar entidades
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        Livro livro = livroRepository.findById(livroId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado."));

        // Validações
        validarCliente(cliente);
        validarDisponibilidadeLivro(livro);
        validarNovoEmprestimo(clienteId, livroId);

        // Criar empréstimo ATIVO
        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setCliente(cliente);
        emprestimo.setLivro(livro);
        emprestimo.setDataRetirada(LocalDate.now());
        emprestimo.setDataRetornoPrevisto(LocalDate.now().plusDays(DIAS_EMPRESTIMO_DIRETO));
        emprestimo.setStatus(Emprestimo.StatusEmprestimo.ATIVO);

        // Reservar livro imediatamente
        livro.emprestar();
        livroRepository.save(livro);

        return emprestimoRepository.save(emprestimo);
    }

    // ============================================================
    // OPERAÇÕES DE ADMIN - Renovar Empréstimo
    // ============================================================

    /**
     * ADMIN: Renova um empréstimo ativo
     * - Adiciona 7 dias ao prazo
     * - Pode renovar se não estiver atrasado
     * - Limite de renovações
     */
    @Transactional
    public Emprestimo renovar(Integer id) {
        Emprestimo emprestimo = buscarPorId(id);

        if (emprestimo.getStatus() != Emprestimo.StatusEmprestimo.ATIVO) {
            throw new RuntimeException("Apenas empréstimos ATIVOS podem ser renovados.");
        }

        // Verificar se está atrasado
        if (emprestimo.getDataRetornoPrevisto().isBefore(LocalDate.now())) {
            throw new RuntimeException("Não é possível renovar empréstimo atrasado.");
        }

        // TODO: Adicionar contador de renovações no model se necessário
        // Por enquanto, permite renovação ilimitada

        // Renovar (adicionar dias)
        emprestimo.setDataRetornoPrevisto(
            emprestimo.getDataRetornoPrevisto().plusDays(DIAS_RENOVACAO)
        );

        return emprestimoRepository.save(emprestimo);
    }

    // ============================================================
    // OPERAÇÕES DE ADMIN - Encerrar/Finalizar Empréstimo
    // ============================================================

    /**
     * ADMIN: Finaliza um empréstimo ativo (devolução)
     * - Registra data de devolução
     * - Devolve o livro ao estoque (aumenta qntDisponivel)
     * - Muda status para FINALIZADO
     */
    @Transactional
    public Emprestimo finalizar(Integer id) {
        Emprestimo emprestimo = buscarPorId(id);

        if (emprestimo.getStatus() != Emprestimo.StatusEmprestimo.ATIVO) {
            throw new RuntimeException("Apenas empréstimos ATIVOS podem ser finalizados.");
        }

        if (emprestimo.getDataRetornoOficial() != null) {
            throw new RuntimeException("Empréstimo já foi finalizado.");
        }

        // Finalizar e devolver livro
        emprestimo.setDataRetornoOficial(LocalDate.now());
        emprestimo.setStatus(Emprestimo.StatusEmprestimo.FINALIZADO);

        Livro livro = emprestimo.getLivro();
        livro.devolver();
        livroRepository.save(livro);

        return emprestimoRepository.save(emprestimo);
    }

    // ============================================================
    // MÉTODOS DE CONSULTA
    // ============================================================

    public List<Emprestimo> listarTodos() {
        return emprestimoRepository.findAll();
    }

    public List<Emprestimo> listarPendentes() {
        return emprestimoRepository.findByStatus(Emprestimo.StatusEmprestimo.PENDENTE);
    }

    public List<Emprestimo> listarAtivos() {
        return emprestimoRepository.findByStatus(Emprestimo.StatusEmprestimo.ATIVO);
    }

    public Emprestimo buscarPorId(Integer id) {
        return emprestimoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado."));
    }

    // ============================================================
    // MÉTODOS LEGADOS (para compatibilidade)
    // ============================================================

    /**
     * @deprecated Use criarDireto() para criar empréstimos pelo admin
     */
    @Deprecated
    public Emprestimo criar(Emprestimo e) {
        return criarDireto(e);
    }

    /**
     * @deprecated Use finalizar() para finalizar empréstimos
     */
    @Deprecated
    public Emprestimo registrarDevolucao(Integer id) {
        return finalizar(id);
    }
}
