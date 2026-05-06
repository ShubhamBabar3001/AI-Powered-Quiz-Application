package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuizResponse {
    private String id;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private int questionsSize;
    private Integer timeLimit;
}
