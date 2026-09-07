package com.intelligrade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.List;

public class DashboardDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DashboardMetricsDto {
        private Long totalSheetsEvaluated;
        private Double averageAiAccuracy;
        private Long pendingTeacherReviews;
        private Double whatsAppDeliveryRate;
        private Long totalExams;
        private Long totalBatches;
        private Map<String, Long> gradeDistribution;
        private List<BatchDto.BatchSummaryDto> recentBatches;
        private List<AuditDto.AuditLogDto> recentActivity;
    }
}
