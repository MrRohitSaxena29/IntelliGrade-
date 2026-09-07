package com.intelligrade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class AuditDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuditLogDto {
        private String logId;
        private String resultId;
        private String userId;
        private String userName;
        private String action;
        private Double priorValue;
        private Double newValue;
        private String justification;
        private LocalDateTime createdAt;
    }
}
