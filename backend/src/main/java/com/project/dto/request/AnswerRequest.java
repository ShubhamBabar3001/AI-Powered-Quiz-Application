package com.project.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class AnswerRequest {
    private String id;
    private List<String> correctAnswer;
}
