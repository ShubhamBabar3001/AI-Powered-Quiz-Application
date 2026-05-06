package com.project.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaderboardResponse {
    private String userId;
    private String name;
    private Integer totalScore;
    private Integer quizzesAttempted;
    private Integer rank;
}
