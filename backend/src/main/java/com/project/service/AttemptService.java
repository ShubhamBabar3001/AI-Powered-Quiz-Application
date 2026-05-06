package com.project.service;

import com.project.dto.response.QuizAttemptResponse;
import com.project.entity.QuizAttempt;
import com.project.entity.User;
import com.project.repository.AttemptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttemptService {

    private final AttemptRepository attemptRepository;
    private final UserService userService;

    public List<QuizAttemptResponse> getAttemptHistory(String userEmail) {
        User user = userService.getUserByEmail(userEmail);

        List<QuizAttempt> attempts = attemptRepository.findByUserId(user.getId());
        return attempts.stream()
                .map(attempt -> new QuizAttemptResponse(
                        attempt.getQuizName(),
                        attempt.getDate(),
                        attempt.getScore(),
                        attempt.getCorrectAnswers(),
                        attempt.getTotalQuestions(),
                        attempt.getTimeSpent()
                ))
                .toList();
    }
}
