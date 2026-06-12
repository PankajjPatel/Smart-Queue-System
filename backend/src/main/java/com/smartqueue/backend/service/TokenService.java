package com.smartqueue.backend.service;

import com.smartqueue.backend.dto.GenerateTokenRequest;
import com.smartqueue.backend.dto.TokenResponseDto;
import com.smartqueue.backend.entity.*;
import com.smartqueue.backend.exception.ResourceNotFoundException;
import com.smartqueue.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final TokenRepository tokenRepository;
    private final QueueRepository queueRepository;
    private final ServiceCounterRepository counterRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public TokenResponseDto generateToken(GenerateTokenRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // For simplicity, take the first available counter for this service at this location
        ServiceCounter counter = counterRepository.findByLocationId(request.getLocationId()).stream()
                .filter(c -> c.getService().getId().equals(request.getServiceId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No counter available for this service"));

        QueueEntity queue = queueRepository.findByCounterId(counter.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Queue not active for this counter"));

        Integer maxNumber = tokenRepository.findMaxTokenNumberByQueueId(queue.getId());
        int nextNumber = maxNumber == null ? 1 : maxNumber + 1;

        Token token = new Token();
        token.setUser(user);
        token.setQueue(queue);
        token.setTokenNumber(nextNumber);
        token.setStatus("PENDING");

        // Simple estimation logic
        long personsAhead = tokenRepository.countPendingTokensInQueue(queue.getId());
        int estWaitMins = queue.getCurrentAverageWaitTime() * (int) personsAhead;
        token.setExpectedServiceTime(LocalDateTime.now().plusMinutes(estWaitMins));
        
        Token savedToken = tokenRepository.save(token);
        
        return new TokenResponseDto(
                savedToken.getId(),
                savedToken.getTokenNumber(),
                savedToken.getStatus(),
                counter.getLocation().getName() + " - " + counter.getName(),
                counter.getService().getName(),
                savedToken.getExpectedServiceTime(),
                personsAhead,
                estWaitMins
        );
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public TokenResponseDto getActiveTokenForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        java.util.List<String> activeStatuses = java.util.Arrays.asList("PENDING", "CALLED", "IN_PROGRESS");
        Token token = tokenRepository.findFirstByUserIdAndStatusInOrderByIssueTimeDesc(user.getId(), activeStatuses)
                .orElseThrow(() -> new ResourceNotFoundException("No active token found for this user"));

        QueueEntity queue = token.getQueue();
        ServiceCounter counter = queue.getCounter();

        long personsAhead = tokenRepository.findByQueueIdAndStatusOrderByTokenNumberAsc(queue.getId(), "PENDING")
                .stream()
                .filter(t -> t.getId() < token.getId())
                .count();
        int estWaitMins = queue.getCurrentAverageWaitTime() * (int) personsAhead;

        return new TokenResponseDto(
                token.getId(),
                token.getTokenNumber(),
                token.getStatus(),
                counter.getLocation().getName() + " - " + counter.getName(),
                counter.getService().getName(),
                token.getExpectedServiceTime(),
                personsAhead,
                estWaitMins
        );
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public TokenResponseDto getTokenStatus(Integer tokenId) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found"));

        QueueEntity queue = token.getQueue();
        ServiceCounter counter = queue.getCounter();

        long personsAhead = 0;
        int estWaitMins = 0;

        if ("PENDING".equals(token.getStatus())) {
            personsAhead = tokenRepository.findByQueueIdAndStatusOrderByTokenNumberAsc(queue.getId(), "PENDING")
                    .stream()
                    .filter(t -> t.getId() < token.getId())
                    .count();
            estWaitMins = queue.getCurrentAverageWaitTime() * (int) personsAhead;
        }

        return new TokenResponseDto(
                token.getId(),
                token.getTokenNumber(),
                token.getStatus(),
                counter.getLocation().getName() + " - " + counter.getName(),
                counter.getService().getName(),
                token.getExpectedServiceTime(),
                personsAhead,
                estWaitMins
        );
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public com.smartqueue.backend.dto.QueueInfoResponseDto getQueueInfo(Integer locationId, Integer serviceId) {
        ServiceCounter counter = counterRepository.findByLocationId(locationId).stream()
                .filter(c -> c.getService().getId().equals(serviceId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No active counter serving this service at this location"));

        QueueEntity queue = queueRepository.findByCounterId(counter.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Queue not active for this counter"));

        long personsAhead = tokenRepository.countPendingTokensInQueue(queue.getId());
        int estWaitMins = queue.getCurrentAverageWaitTime() * (int) personsAhead;

        return new com.smartqueue.backend.dto.QueueInfoResponseDto(
                personsAhead,
                estWaitMins,
                counter.getName()
        );
    }
}
