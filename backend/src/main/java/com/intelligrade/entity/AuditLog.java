package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @Column(name = "log_id", length = 64)
    private String logId;

    @Column(name = "result_id", length = 64, nullable = false)
    private String resultId;

    @Column(name = "question_id", length = 64, nullable = false)
    private String questionId;

    @Column(name = "user_id", length = 64, nullable = false)
    private String userId;

    @Column(name = "user_name", nullable = false, length = 128)
    private String userName;

    @Column(name = "change_type", nullable = false, length = 32)
    private String changeType; // MARKS_OVERRIDE, STATUS_APPROVE, FEEDBACK_EDIT

    @Column(name = "old_marks", nullable = false)
    private Double oldMarks;

    @Column(name = "new_marks", nullable = false)
    private Double newMarks;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
