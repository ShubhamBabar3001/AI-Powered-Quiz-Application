package com.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ContestCreateRequest {

    @NotBlank
    private String title;

    private String description;
    private String image;
    private String difficulty;

    @NotBlank
    private String prizePool;

    @NotNull
    private LocalDateTime deadline;

    private String status = "UPCOMING";
    // "UPCOMING" or "ACTIVE", defaults to "UPCOMING"

    private List<String> tags;
}
