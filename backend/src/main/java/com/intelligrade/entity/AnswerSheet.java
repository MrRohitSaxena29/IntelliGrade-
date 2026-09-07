package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "answer_sheets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerSheet {

    @Id
    @Column(name = "sheet_id", length = 64)
    private String sheetId;

    @Column(name = "batch_upload_id", length = 64, nullable = false)
    private String batchUploadId;

    @Column(name = "student_id", length = 64)
    private String studentId;

    @Column(name = "extracted_student_roll", length = 64)
    private String extractedStudentRoll;

    @Column(name = "s3_pdf_url", nullable = false, columnDefinition = "TEXT")
    private String s3PdfUrl;

    @Column(name = "page_count", nullable = false)
    private Integer pageCount;

    @Column(nullable = false, length = 32)
    private String status; // QUEUED, PROCESSING, AI_GRADED, TEACHER_REVIEWED, PUBLISHED

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
        if (pageCount == null) {
            pageCount = 1;
        }
        if (status == null) {
            status = "QUEUED";
        }
    }
}
