package com.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptResponse {
    private String quizName;
    private String date;
    private Integer score;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private Integer timeSpent;
}
