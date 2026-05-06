package com.project.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@Document(collection = "ai_quizzes")
public class AiQuiz {
    @Id
    private String id;

    private String title;
    private String difficulty; // EASY, MEDIUM, HARD
    private Integer timeLimit; // in minutes
    private List<String> questions; // Questions Id
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public AiQuiz(){
        this.questions = new ArrayList<>();
    }
}
