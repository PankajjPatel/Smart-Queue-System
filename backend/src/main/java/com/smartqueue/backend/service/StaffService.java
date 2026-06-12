package com.smartqueue.backend.service;

import com.smartqueue.backend.entity.*;
import com.smartqueue.backend.exception.ResourceNotFoundException;
import com.smartqueue.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final UserRepository userRepository;
    private final StaffCounterAssignmentRepository assignmentRepository;
    private final QueueRepository queueRepository;
    private final TokenRepository tokenRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getStaffDashboardData(String email) {
        User staff = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found"));

        StaffCounterAssignment assignment = assignmentRepository.findByUserIdAndStatus(staff.getId(), "ACTIVE")
                .orElseThrow(() -> new ResourceNotFoundException("No active counter assignment found for this staff member"));

        ServiceCounter counter = assignment.getCounter();
        QueueEntity queue = queueRepository.findByCounterId(counter.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No active queue found for counter " + counter.getName()));

        Map<String, Object> data = new HashMap<>();
        data.put("counterId", counter.getId());
        data.put("counterName", counter.getName());
        data.put("locationName", counter.getLocation().getName());
        data.put("serviceName", counter.getService().getName());

        long waitingCount = tokenRepository.countPendingTokensInQueue(queue.getId());
        data.put("waitingCount", waitingCount);

        long completedCount = tokenRepository.countByQueueIdAndStatus(queue.getId(), "COMPLETED");
        data.put("completedCount", completedCount);

        data.put("averageWaitTime", queue.getCurrentAverageWaitTime());

        // Currently Serving (CALLED or IN_PROGRESS)
        Token currentlyServing = tokenRepository.findByQueueIdAndStatusOrderByTokenNumberAsc(queue.getId(), "CALLED")
                .stream().findFirst()
                .orElseGet(() -> tokenRepository.findByQueueIdAndStatusOrderByTokenNumberAsc(queue.getId(), "IN_PROGRESS")
                        .stream().findFirst().orElse(null));

        if (currentlyServing != null) {
            Map<String, Object> tokenInfo = new HashMap<>();
            tokenInfo.put("id", currentlyServing.getId());
            tokenInfo.put("tokenNumber", currentlyServing.getTokenNumber());
            tokenInfo.put("status", currentlyServing.getStatus());
            data.put("currentlyServing", tokenInfo);
        } else {
            data.put("currentlyServing", null);
        }

        // Next in Line (PENDING)
        Token nextInLine = tokenRepository.findByQueueIdAndStatusOrderByTokenNumberAsc(queue.getId(), "PENDING")
                .stream().findFirst().orElse(null);

        if (nextInLine != null) {
            Map<String, Object> nextInfo = new HashMap<>();
            nextInfo.put("id", nextInLine.getId());
            nextInfo.put("tokenNumber", nextInLine.getTokenNumber());
            nextInfo.put("status", nextInLine.getStatus());
            data.put("nextInLine", nextInfo);
        } else {
            data.put("nextInLine", null);
        }

        // History (COMPLETED or SKIPPED)
        List<Token> completedTokens = tokenRepository.findByQueueIdAndStatusOrderByTokenNumberAsc(queue.getId(), "COMPLETED");
        List<Token> skippedTokens = tokenRepository.findByQueueIdAndStatusOrderByTokenNumberAsc(queue.getId(), "SKIPPED");
        
        List<Token> allHistory = new ArrayList<>();
        allHistory.addAll(completedTokens);
        allHistory.addAll(skippedTokens);
        
        // Sort history by token number desc (most recent first)
        allHistory.sort((t1, t2) -> t2.getTokenNumber().compareTo(t1.getTokenNumber()));

        List<Map<String, Object>> historyData = allHistory.stream().limit(10).map(t -> {
            Map<String, Object> historyItem = new HashMap<>();
            historyItem.put("id", t.getId());
            historyItem.put("tokenNumber", t.getTokenNumber());
            historyItem.put("status", t.getStatus());
            historyItem.put("time", t.getExpectedServiceTime() != null ? t.getExpectedServiceTime().toString() : "");
            return historyItem;
        }).collect(Collectors.toList());

        data.put("history", historyData);

        return data;
    }

    @Transactional
    public Map<String, Object> callNextToken(String email) {
        User staff = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found"));

        StaffCounterAssignment assignment = assignmentRepository.findByUserIdAndStatus(staff.getId(), "ACTIVE")
                .orElseThrow(() -> new ResourceNotFoundException("No active counter assignment found"));

        ServiceCounter counter = assignment.getCounter();
        QueueEntity queue = queueRepository.findByCounterId(counter.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No active queue found"));

        // Check if there is already a token currently serving
        Token currentlyServing = tokenRepository.findByQueueIdAndStatusOrderByTokenNumberAsc(queue.getId(), "CALLED")
                .stream().findFirst()
                .orElseGet(() -> tokenRepository.findByQueueIdAndStatusOrderByTokenNumberAsc(queue.getId(), "IN_PROGRESS")
                        .stream().findFirst().orElse(null));

        if (currentlyServing != null) {
            throw new IllegalStateException("Finish serving the current Token #" + currentlyServing.getTokenNumber() + " first.");
        }

        // Get the next PENDING token
        Token nextToken = tokenRepository.findByQueueIdAndStatusOrderByTokenNumberAsc(queue.getId(), "PENDING")
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No pending tokens in the queue."));

        nextToken.setStatus("CALLED");
        tokenRepository.save(nextToken);

        Map<String, Object> response = new HashMap<>();
        response.put("id", nextToken.getId());
        response.put("tokenNumber", nextToken.getTokenNumber());
        response.put("status", nextToken.getStatus());
        return response;
    }

    @Transactional
    public void skipToken(Integer tokenId, String email) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found"));

        token.setStatus("SKIPPED");
        tokenRepository.save(token);
    }

    @Transactional
    public void completeToken(Integer tokenId, String email) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found"));

        token.setStatus("COMPLETED");
        tokenRepository.save(token);
    }
}
