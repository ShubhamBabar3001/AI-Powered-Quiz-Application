package com.project.dto.response;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;
@Data
public class QuestionResponse {
    @Id
    private String id;
    private String text;
    private String type;
    private List<String> options;
}
