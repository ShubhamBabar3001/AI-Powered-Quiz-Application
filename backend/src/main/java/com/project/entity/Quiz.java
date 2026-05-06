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
@Document(collection = "quizzes")
public class Quiz {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private String type; // aptitude, technical
    private String difficulty; // EASY, MEDIUM, HARD
    private Integer timeLimit; // in minutes
    private List<String> questions; // Questions Id
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public Quiz(){
        this.questions = new ArrayList<>();
    }
}
