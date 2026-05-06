package com.project.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@Document(collection = "contests")
public class Contest {

    @Id
    private String id;

    private String title;
    private String description;
    private String image;
    private String difficulty;
    private String prizePool;
    private List<String> participants; // user IDs
    private LocalDateTime deadline;
    private String status; // ACTIVE, UPCOMING
    private List<String> tags;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public Contest(){
        this.participants = new ArrayList<>();
        this.tags = new ArrayList<>();
    }

}
