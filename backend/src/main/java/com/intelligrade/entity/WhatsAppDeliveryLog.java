package com.intelligrade.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "whatsapp_delivery_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WhatsAppDeliveryLog {

    @Id
    @Column(name = "delivery_id", length = 64)
    private String deliveryId;

    @Column(name = "result_id", length = 64, nullable = false)
    private String resultId;

    @Column(name = "student_id", length = 64, nullable = false)
    private String studentId;

    @Column(name = "student_name", nullable = false, length = 128)
    private String studentName;

    @Column(name = "roll_number", nullable = false, length = 64)
    private String rollNumber;

    @Column(name = "whatsapp_phone_number", nullable = false, length = 32)
    private String whatsappPhoneNumber;

    @Column(name = "message_id_external", nullable = false, length = 128)
    private String messageIdExternal;

    @Column(name = "delivery_status", nullable = false, length = 32)
    private String deliveryStatus; // QUEUED, SENT, DELIVERED, READ, FAILED

    @Column(name = "payload_summary", columnDefinition = "TEXT")
    private String payloadSummary;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "dispatched_at")
    private LocalDateTime dispatchedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @PrePersist
    protected void onCreate() {
        if (dispatchedAt == null) {
            dispatchedAt = LocalDateTime.now();
        }
        if (deliveryStatus == null) {
            deliveryStatus = "QUEUED";
        }
    }
}
