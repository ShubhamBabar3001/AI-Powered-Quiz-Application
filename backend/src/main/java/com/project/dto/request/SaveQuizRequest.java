package com.project.dto.request;
import lombok.Data;

import java.util.List;
@Data
public class SaveQuizRequest {
    @Data
    public static class TempQuestion{
        private String text;
        private String type; // MULTIPLE_CHOICE, TRUE_FALSE, TEXT
        private List<String> options;
        private List<String> correctAnswer;
        private String explanation;

        @Override
        public String toString() {
            return "TempQuestion{" +
                    "text='" + text + '\'' +
                    ", type='" + type + '\'' +
                    ", options=" + options +
                    ", correctAnswer='" + correctAnswer + '\'' +
                    ", explanation='" + explanation + '\'' +
                    '}';
        }
    }
    private String title;
    private String description;
    private String category;
    private String type;
    private String difficulty; // EASY, MEDIUM, HARD
    private Integer timeLimit;
    List<TempQuestion> questions;
}
