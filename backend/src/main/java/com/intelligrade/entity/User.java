package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(name = "user_id", length = 64)
    private String userId;

    @Column(name = "institute_id", length = 64, nullable = false)
    private String instituteId;

    @Column(nullable = false, length = 128)
    private String name;

    @Column(nullable = false, unique = true, length = 128)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "role_enum", nullable = false, length = 32)
    private String roleEnum; // TEACHER, ADMIN, EVALUATOR

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
