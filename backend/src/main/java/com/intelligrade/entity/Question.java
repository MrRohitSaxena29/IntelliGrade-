package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "questions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"exam_id", "question_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @Column(name = "question_id", length = 64)
    private String questionId;

    @Column(name = "exam_id", length = 64, nullable = false)
    private String examId;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "max_marks", nullable = false)
    private Double maxMarks;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
