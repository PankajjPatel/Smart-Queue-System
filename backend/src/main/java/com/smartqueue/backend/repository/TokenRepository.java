package com.smartqueue.backend.repository;

import com.smartqueue.backend.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    List<Token> findByUserIdOrderByIssueTimeDesc(Integer userId);
    
    List<Token> findByQueueIdAndStatusOrderByTokenNumberAsc(Integer queueId, String status);

    @Query("SELECT COUNT(t) FROM Token t WHERE t.queue.id = :queueId AND t.status = 'PENDING'")
    long countPendingTokensInQueue(@Param("queueId") Integer queueId);
    
    @Query("SELECT MAX(t.tokenNumber) FROM Token t WHERE t.queue.id = :queueId")
    Integer findMaxTokenNumberByQueueId(@Param("queueId") Integer queueId);

    @Query("SELECT COUNT(t) FROM Token t WHERE FUNCTION('DATE', t.issueTime) = FUNCTION('CURRENT_DATE')")
    long countTokensToday();

    List<Token> findByUserIdAndStatusInOrderByIssueTimeDesc(Integer userId, List<String> statuses);

    java.util.Optional<Token> findFirstByUserIdAndStatusInOrderByIssueTimeDesc(Integer userId, List<String> statuses);

    long countByQueueIdAndStatus(Integer queueId, String status);
}
