package com.intelligrade.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluation_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationItem {

    @Id
    @Column(name = "eval_item_id", length = 64)
    private String evalItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id", nullable = false)
    @JsonIgnore
    private Result result;

    @Column(name = "question_id", length = 64, nullable = false)
    private String questionId;

    @Column(name = "rubric_id", length = 64)
    private String rubricId;

    @Column(name = "marks_awarded", nullable = false)
    private Double marksAwarded;

    @Column(name = "max_marks", nullable = false)
    private Double maxMarks;

    @Column(name = "ai_justification", columnDefinition = "TEXT")
    private String aiJustification;

    @Column(name = "key_positives", columnDefinition = "TEXT")
    private String keyPositivesJson; // Stored as JSON string ["...", "..."]

    @Column(name = "key_gaps", columnDefinition = "TEXT")
    private String keyGapsJson; // Stored as JSON string ["...", "..."]

    @Column(name = "teacher_marks")
    private Double teacherMarks;

    @Column(name = "teacher_notes", columnDefinition = "TEXT")
    private String teacherNotes;

    @Column(name = "is_overridden", nullable = false)
    private Boolean isOverridden;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (isOverridden == null) {
            isOverridden = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
