package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ocr_bounding_boxes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OCRBoundingBox {

    @Id
    @Column(name = "box_id", length = 64)
    private String boxId;

    @Column(name = "page_id", length = 64, nullable = false)
    private String pageId;

    @Column(name = "question_id", length = 64)
    private String questionId;

    @Column(name = "coord_x", nullable = false)
    private Double coordX;

    @Column(name = "coord_y", nullable = false)
    private Double coordY;

    @Column(name = "coord_width", nullable = false)
    private Double coordWidth;

    @Column(name = "coord_height", nullable = false)
    private Double coordHeight;

    @Column(name = "detected_text", nullable = false, columnDefinition = "TEXT")
    private String detectedText;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @Column(name = "line_index", nullable = false)
    private Integer lineIndex;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
