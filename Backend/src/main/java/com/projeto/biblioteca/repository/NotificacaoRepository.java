package com.projeto.biblioteca.repository;

import com.projeto.biblioteca.model.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Integer> {

    List<Notificacao> findByClienteIdAndLidaFalseOrderByDataCriacaoDesc(Integer clienteId);

    long countByClienteIdAndLidaFalse(Integer clienteId);

    void deleteByClienteIdAndLivroId(Integer clienteId, Integer livroId);

    @Query("SELECT n FROM Notificacao n WHERE n.cliente.id = :clienteId AND n.tipoNotificacao = 'VENCIMENTO_PROXIMO' AND n.livro.id = :livroId AND n.dataCriacao >= :dataLimite")
    List<Notificacao> findRecentVencimentoNotificacao(@Param("clienteId") Integer clienteId,
                                                       @Param("livroId") Integer livroId,
                                                       @Param("dataLimite") LocalDateTime dataLimite);

    boolean existsByClienteIdAndTipoNotificacaoAndLivroIdAndDataCriacaoAfter(
        Integer clienteId,
        Notificacao.TipoNotificacao tipoNotificacao,
        Integer livroId,
        LocalDateTime dataCriacao
    );
}
