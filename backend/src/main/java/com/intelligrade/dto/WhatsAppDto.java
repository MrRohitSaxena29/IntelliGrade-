package com.intelligrade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class WhatsAppDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WhatsAppDispatchRequest {
        private String examId;
        private List<String> studentIds;
        private String customMessage;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WhatsAppDispatchResponse {
        private Integer totalDispatched;
        private Integer queuedCount;
        private String status;
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WhatsAppDeliveryLogDto {
        private String dispatchId;
        private String resultId;
        private String studentId;
        private String studentName;
        private String recipientPhone;
        private String messageIdExternal;
        private String deliveryStatus;
        private LocalDateTime dispatchedAt;
        private LocalDateTime deliveredAt;
        private LocalDateTime readAt;
        private String failureReason;
    }
}
