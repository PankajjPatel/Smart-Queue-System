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
}
