package com.intelligrade.service;

import com.intelligrade.dto.AuditDto;
import com.intelligrade.entity.AuditLog;
import com.intelligrade.entity.User;
import com.intelligrade.repository.AuditLogRepository;
import com.intelligrade.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AuditDto.AuditLogDto> getAllLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuditDto.AuditLogDto> getLogsForResult(String resultId) {
        return auditLogRepository.findByResultIdOrderByCreatedAtDesc(resultId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AuditLog recordLog(String resultId, String userId, String action, Double priorValue, Double newValue, String justification) {
        String logId = "log-" + UUID.randomUUID().toString().substring(0, 8);
        String resolvedUserName = userRepository.findById(userId != null ? userId : "usr-101")
                .map(User::getName)
                .orElse("Faculty Evaluator");

        AuditLog log = AuditLog.builder()
                .logId(logId)
                .resultId(resultId)
                .questionId("Q1")
                .userId(userId != null ? userId : "usr-101")
                .userName(resolvedUserName)
                .changeType(action)
                .oldMarks(priorValue != null ? priorValue : 0.0)
                .newMarks(newValue != null ? newValue : 0.0)
                .reason(justification != null ? justification : "Manual evaluation review")
                .createdAt(LocalDateTime.now())
                .build();

        return auditLogRepository.save(log);
    }

    private AuditDto.AuditLogDto mapToDto(AuditLog log) {
        return AuditDto.AuditLogDto.builder()
                .logId(log.getLogId())
                .resultId(log.getResultId())
                .userId(log.getUserId())
                .userName(log.getUserName())
                .action(log.getChangeType())
                .priorValue(log.getOldMarks())
                .newValue(log.getNewMarks())
                .justification(log.getReason())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
