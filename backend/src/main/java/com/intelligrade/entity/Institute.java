package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "institutes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Institute {

    @Id
    @Column(name = "institute_id", length = 64)
    private String instituteId;

    @Column(nullable = false)
    private String name;

    @Column(name = "branding_logo_url", columnDefinition = "TEXT")
    private String brandingLogoUrl;

    @Column(name = "primary_color", length = 32)
    private String primaryColor;

    @Column(name = "accent_color", length = 32)
    private String accentColor;

    @Column(length = 255)
    private String tagline;

    @Column(name = "whatsapp_api_config_json", columnDefinition = "TEXT")
    private String whatsappApiConfigJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
