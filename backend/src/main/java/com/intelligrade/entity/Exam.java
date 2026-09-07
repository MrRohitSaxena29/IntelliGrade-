package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exam {

    @Id
    @Column(name = "exam_id", length = 64)
    private String examId;

    @Column(name = "institute_id", length = 64, nullable = false)
    private String instituteId;

    @Column(name = "exam_title", nullable = false)
    private String examTitle;

    @Column(nullable = false, length = 128)
    private String subject;

    @Column(name = "total_marks", nullable = false)
    private Double totalMarks;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "academic_year", nullable = false, length = 32)
    private String academicYear;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
