package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"institute_id", "roll_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @Column(name = "student_id", length = 64)
    private String studentId;

    @Column(name = "institute_id", length = 64, nullable = false)
    private String instituteId;

    @Column(nullable = false, length = 128)
    private String name;

    @Column(name = "roll_number", nullable = false, length = 64)
    private String rollNumber;

    @Column(name = "whatsapp_phone_number", nullable = false, length = 32)
    private String whatsappPhoneNumber;

    @Column(name = "grade_section", nullable = false, length = 64)
    private String gradeSection;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
