package com.intelligrade.repository;

import com.intelligrade.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    List<AuditLog> findByResultIdOrderByCreatedAtDesc(String resultId);
    List<AuditLog> findAllByOrderByCreatedAtDesc();
}
