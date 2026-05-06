package com.project.service;

import com.project.dto.response.LeaderboardResponse;
import com.project.entity.User;
import com.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaderboardService {

    private final UserRepository userRepository;

    @Cacheable(value = "leaderboard", key = "#limit")
    public List<LeaderboardResponse> getLeaderboard(int limit) {
        List<User> users = userRepository.findAll();
        // Sort by totalScore descending
        users.sort(Comparator.comparing(User::getTotalScore).reversed());

        // Assign ranks
        List<LeaderboardResponse> responses = users.stream()
                .limit(limit)
                .map(user -> LeaderboardResponse.builder()
                        .userId(user.getId())
                        .name(user.getName())
                        .totalScore(user.getTotalScore())
                        .quizzesAttempted(user.getQuizzesAttempted())
                        .rank(user.getRank())
                        .build())
                .collect(Collectors.toList());

        // Update ranks in DB if needed (for simplicity, just return)
        return responses;
    }
}
