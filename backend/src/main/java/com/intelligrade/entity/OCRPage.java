package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ocr_pages", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"sheet_id", "page_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OCRPage {

    @Id
    @Column(name = "page_id", length = 64)
    private String pageId;

    @Column(name = "sheet_id", length = 64, nullable = false)
    private String sheetId;

    @Column(name = "page_number", nullable = false)
    private Integer pageNumber;

    @Column(name = "full_text_content", columnDefinition = "TEXT")
    private String fullTextContent;

    @Column(name = "image_preview_url", nullable = false, columnDefinition = "TEXT")
    private String imagePreviewUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
