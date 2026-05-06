package com.project.dto.request;

public record GenerateQuestionsRequest(
        String topic,
        String difficulty, // EASY, MEDIUM, HARD
        int count,
        int timeLimit

) {}