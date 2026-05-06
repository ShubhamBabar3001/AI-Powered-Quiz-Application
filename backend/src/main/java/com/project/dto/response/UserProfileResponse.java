package com.project.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
public class UserProfileResponse {
    private String id;
    private String name;
    private String email;
    private Integer totalScore;
    private Integer quizzesAttempted;
    private Integer rank;
    private Integer streak;
    private List<String> roles;
}
