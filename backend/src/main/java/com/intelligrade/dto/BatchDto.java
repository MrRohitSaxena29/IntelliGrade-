package com.intelligrade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class BatchDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BatchSummaryDto {
        private String uploadId;
        private String examId;
        private String examTitle;
        private String userId;
        private String batchName;
        private String batchStatus;
        private String s3ArchiveUrl;
        private Integer totalSheets;
        private Integer processedSheets;
        private String processingStep;
        private LocalDateTime uploadedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BatchUploadResponse {
        private String uploadId;
        private String batchName;
        private String batchStatus;
        private Integer totalSheets;
        private String message;
    }
}
