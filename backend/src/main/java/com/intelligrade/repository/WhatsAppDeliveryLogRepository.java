package com.intelligrade.repository;

import com.intelligrade.entity.WhatsAppDeliveryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WhatsAppDeliveryLogRepository extends JpaRepository<WhatsAppDeliveryLog, String> {
    List<WhatsAppDeliveryLog> findByResultId(String resultId);
    List<WhatsAppDeliveryLog> findAllByOrderByDispatchedAtDesc();
    Optional<WhatsAppDeliveryLog> findByMessageIdExternal(String messageIdExternal);
}
