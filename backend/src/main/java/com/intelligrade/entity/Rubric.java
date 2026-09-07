package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rubrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rubric {

    @Id
    @Column(name = "rubric_id", length = 64)
    private String rubricId;

    @Column(name = "question_id", length = 64, nullable = false)
    private String questionId;

    @Column(name = "criteria_text", nullable = false, columnDefinition = "TEXT")
    private String criteriaText;

    @Column(name = "weightage_points", nullable = false)
    private Double weightagePoints;

    @Column(name = "ai_grading_prompt", columnDefinition = "TEXT")
    private String aiGradingPrompt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
