package com.project.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AIQuizGenerationRequest {

    @NotBlank
    private String topic;

    @NotBlank
    private String difficulty; // EASY, MEDIUM, HARD

    @Min(1)
    @Max(100)
    private int questionCount;
}
