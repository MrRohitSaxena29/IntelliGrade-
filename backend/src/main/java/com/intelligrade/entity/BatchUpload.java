package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "batch_uploads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchUpload {

    @Id
    @Column(name = "upload_id", length = 64)
    private String uploadId;

    @Column(name = "exam_id", length = 64, nullable = false)
    private String examId;

    @Column(name = "user_id", length = 64, nullable = false)
    private String userId;

    @Column(name = "batch_name", nullable = false)
    private String batchName;

    @Column(name = "batch_status", nullable = false, length = 32)
    private String batchStatus; // QUEUED, PROCESSING, AI_GRADED, TEACHER_REVIEWED, PUBLISHED

    @Column(name = "s3_archive_url", columnDefinition = "TEXT")
    private String s3ArchiveUrl;

    @Column(name = "total_sheets", nullable = false)
    private Integer totalSheets;

    @Column(name = "processed_sheets", nullable = false)
    private Integer processedSheets;

    @Column(name = "processing_step", columnDefinition = "TEXT")
    private String processingStep;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
        if (totalSheets == null) {
            totalSheets = 0;
        }
        if (processedSheets == null) {
            processedSheets = 0;
        }
        if (batchStatus == null) {
            batchStatus = "QUEUED";
        }
    }
}
