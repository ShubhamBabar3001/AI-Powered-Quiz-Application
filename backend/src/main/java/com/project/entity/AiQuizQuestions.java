package com.project.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_questions")
public class AiQuizQuestions {
    @Id
    private String id;
    private String text;
    private String type; // MULTIPLE or SINGLE
    private List<String> options;
    private List<String> correctAnswer;
    private String explanation;
}
