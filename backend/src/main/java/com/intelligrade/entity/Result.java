package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Result {

    @Id
    @Column(name = "result_id", length = 64)
    private String resultId;

    @Column(name = "sheet_id", length = 64, nullable = false, unique = true)
    private String sheetId;

    @Column(name = "exam_id", length = 64, nullable = false)
    private String examId;

    @Column(name = "student_id", length = 64, nullable = false)
    private String studentId;

    @Column(name = "final_score", nullable = false)
    private Double finalScore;

    @Column(name = "total_marks", nullable = false)
    private Double totalMarks;

    @Column(nullable = false)
    private Double percentage;

    @Column(name = "grade_letter", length = 8, nullable = false)
    private String gradeLetter;

    @Column(name = "overall_feedback", columnDefinition = "TEXT")
    private String overallFeedback;

    @Column(nullable = false, length = 32)
    private String status; // QUEUED, PROCESSING, AI_GRADED, TEACHER_REVIEWED, PUBLISHED

    @Column(name = "s3_report_url", columnDefinition = "TEXT")
    private String s3ReportUrl;

    @Column(name = "approved_by_user_id", length = 64)
    private String approvedByUserId;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "result", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<EvaluationItem> evaluationItems = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (finalScore == null) {
            finalScore = 0.0;
        }
        if (percentage == null) {
            percentage = 0.0;
        }
        if (gradeLetter == null) {
            gradeLetter = "N/A";
        }
        if (status == null) {
            status = "AI_GRADED";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
