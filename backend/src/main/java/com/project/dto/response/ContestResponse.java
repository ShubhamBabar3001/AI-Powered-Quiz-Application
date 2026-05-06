package com.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestResponse {
    private String id;
    private String title;
    private String description;
    private String image;
    private String difficulty;
    private String prizePool;
    private List<String> participants;
    private String deadline;
    private String status;
    private List<String> tags;
}
